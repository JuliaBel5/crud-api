import cluster, { Worker } from 'node:cluster';
import { availableParallelism } from 'node:os';
import {
  createServer,
  IncomingMessage,
  request as httpRequest,
  ServerResponse,
} from 'http';
import * as dotenv from 'dotenv';
import { requestListener } from './routes/routes';
import { User } from './users';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);
const numCPUs = availableParallelism();
let currentWorkerIndex = 0;

const inMemoryDatabase: Record<string, User> = {};

interface WorkerMessage {
  action: string;
  payload?: any;
}

const broadcastToWorkers = (action: string, payload: any) => {
  console.log(
    `Отправляем сообщение воркерам: action=${action}, payload=`,
    payload
  );
  const workers = cluster.workers ? Object.values(cluster.workers) : [];
  workers.forEach((worker) => {
    worker?.send({ action, payload });
  });
};

const handleWorkerMessages = (worker: Worker) => {
  worker.on('message', (msg: WorkerMessage) => {
    const { action, payload } = msg;

    switch (action) {
      case 'GET_DB':
        worker.send({ action: 'DB_DATA', payload: inMemoryDatabase });
        break;
      case 'USER_CREATED':
        console.log('Пользователь создан:', payload);
        inMemoryDatabase[payload.id] = payload;
        broadcastToWorkers('DB_DATA', inMemoryDatabase);
        break;

      case 'UPDATE_DB':
        console.log('Обновление базы данных:', payload);

        inMemoryDatabase[payload.id] = {
          ...inMemoryDatabase[payload.id],
          ...payload,
        };

        broadcastToWorkers('DB_DATA', inMemoryDatabase);
        break;
      case 'DELETE_USER':
        console.log('Удаление пользователя:', payload);
        delete inMemoryDatabase[payload];
        broadcastToWorkers('DB_DATA', inMemoryDatabase);
        break;
    }
  });
};

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    handleWorkerMessages(worker);

    worker.on('exit', (worker: Worker, code: number, signal: string | null) => {
      console.log(
        `Воркер ${worker.process.pid} завершился с кодом ${code} и сигналом ${signal}. Перезапускаем...`
      );
      const newWorker = cluster.fork();
      handleWorkerMessages(newWorker);
    });
  }

  createServer((req: IncomingMessage, res: ServerResponse) => {
    const workers = cluster.workers ? Object.values(cluster.workers) : [];

    if (workers.length === 0) {
      res.writeHead(500);
      return res.end('Нет доступных воркеров');
    }

    console.log(`Балансировка запроса: ${req.method} ${req.url}`);

    const worker = workers[currentWorkerIndex % workers.length];
    currentWorkerIndex++;

    const options = {
      hostname: 'localhost',
      port: PORT + (worker?.id || 0),
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = httpRequest(options, (workerRes) => {
      console.log(
        `Ответ от воркера ${worker?.process.pid}: ${workerRes.statusCode}`
      );
      res.writeHead(workerRes.statusCode || 500, workerRes.headers);
      workerRes.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });

    proxy.on('error', (err) => {
      console.error(`Ошибка при проксировании запроса: ${err.message}`);
      res.writeHead(500);
      res.end('Что-то пошло не так с запросом.');
    });
  }).listen(PORT, () => {
    console.log(`Балансировщик запущен на http://localhost:${PORT}`);
  });
} else if (cluster.isWorker && cluster.worker?.id) {
  const workerPort = PORT + cluster.worker?.id;

  createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log(
      `Воркер ${process.pid} получил запрос: ${req.method} ${req.url}`
    );
    requestListener(req, res);
  }).listen(workerPort, () => {
    console.log(`Воркер ${process.pid} слушает на порту ${workerPort}`);
  });

  process.on('message', (msg: WorkerMessage) => {
    const { action, payload } = msg;

    if (action === 'DB_DATA') {
      Object.assign(inMemoryDatabase, payload);
    }

    if (action === 'UPDATE_DB') {
      if (payload && payload.id) {
        console.log(`Updating user in memory: ${payload.id}`);
        inMemoryDatabase[payload.id] = payload;
        console.log(`Worker ${process.pid} updated user ${payload.id}`);

        broadcastToWorkers('DB_DATA', inMemoryDatabase);
      } else {
        console.error('No valid payload received for update.');
      }
    }

    if (action === 'DELETE_USER') {
      if (payload) {
        console.log(`Deleting user in memory: ${payload}`);
        delete inMemoryDatabase[payload];
        console.log(`Worker ${process.pid} deleted user ${payload}`);

        broadcastToWorkers('DB_DATA', inMemoryDatabase);
      } else {
        console.error('No valid payload received for deletion.');
      }
    }
  });
}
