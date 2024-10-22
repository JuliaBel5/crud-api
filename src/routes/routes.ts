import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../users';
import { handleErrors } from '../middleware/errors';
import { isValidUserId } from '../utils';

export const requestListener = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const { method, url } = req;
  const parsedUrl = parse(url!, true);
  const userId = parsedUrl.pathname?.split('/').pop();
  try {
    if (parsedUrl.pathname === '/api/users' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const users = await getAllUsers();
      res.end(JSON.stringify({ success: true, users }));
    } else if (
      method === 'GET' &&
      parsedUrl.pathname?.startsWith('/api/users/')
    ) {
      if (!isValidUserId(userId!)) {
        handleErrors(res, 400, 'Invalid userId');
        return;
      }

      const user = await getUserById(userId!);
      if (!user) {
        handleErrors(res, 404, 'User not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else if (parsedUrl.pathname === '/api/users' && method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const { username, age, hobbies } = JSON.parse(body);
          if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
            handleErrors(res, 400, 'Invalid user data');
            return;
          }
          const newUser = createUser(username, age, hobbies);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newUser));
        } catch {
          handleErrors(res, 400, 'Invalid JSON');
        }
      });
    } else if (
      method === 'PUT' &&
      parsedUrl.pathname?.startsWith('/api/users/')
    ) {
      if (!isValidUserId(userId!)) {
        handleErrors(res, 400, 'Invalid userId');
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const { username, age, hobbies } = JSON.parse(body);
          const updatedUser = await updateUser(userId!, username, age, hobbies);
          if (!updatedUser) {
            handleErrors(res, 404, 'User not found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedUser));
        } catch {
          handleErrors(res, 400, 'Invalid JSON');
        }
      });
    } else if (
      method === 'DELETE' &&
      parsedUrl.pathname?.startsWith('/api/users/')
    ) {
      if (!isValidUserId(userId!)) {
        handleErrors(res, 400, 'Invalid userId');
        return;
      }

      const isDeleted = await deleteUser(userId!);
      if (!isDeleted) {
        handleErrors(res, 404, 'User not found');
        return;
      }
      res.writeHead(204);
      res.end(JSON.stringify({ message: 'User deleted successfully' }));
    } else if (parsedUrl.pathname === '/api/error' && method === 'GET') {
      throw new Error('This is a forced error for testing purposes.');
    } else {
      handleErrors(res, 404, 'Not found');
    }
  } catch {
    handleErrors(res, 500, 'Internal Server Error');
  }
};
