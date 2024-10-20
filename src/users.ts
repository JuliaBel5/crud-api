import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface WorkerMessage {
  action: string;
  payload: any;
}

let users: User[] = [];

const isMultiMode = process.env.MULTI_MODE === "true";

const syncUsersWithMaster = () => {
  return new Promise<User[]>((resolve) => {
    console.log("Запрос данных от главного процесса...");
    process.send?.({ action: "GET_DB" });
    process.once("message", (msg: unknown) => {
      const message = msg as WorkerMessage;
      if (message.action === "DB_DATA") {
        console.log("Получены данные от главного процесса:", message.payload);
        users = Object.values(message.payload);
        resolve(users);
      }
    });
  });
};

export const getAllUsers = async () => {
  if (isMultiMode) {
    return await syncUsersWithMaster();
  } else {
    console.log("Текущий список пользователей:", users);
    return users;
  }
};

export const getUserById = (id: string) => {
  if (isMultiMode) {
    return syncUsersWithMaster().then((syncedUsers) => {
      console.log("Поиск пользователя по ID:", id);
      return syncedUsers.find((user) => user.id === id);
    });
  }
  const user = users.find((user) => user.id === id);
  return user;
};

export const createUser = (
  username: string,
  age: number,
  hobbies: string[]
) => {
  const newUser = { id: uuidv4(), username, age, hobbies };
  users.push(newUser);
  console.log("Создан новый пользователь:", users);

  if (isMultiMode) {
    console.log("Отправка обновления пользователям...");
    process.send?.({ action: "UPDATE_DB", payload: newUser });
  }

  process.send?.({ action: "USER_CREATED", payload: newUser });

  return newUser;
};

export const updateUser = (
  id: string,
  username: string,
  age: number,
  hobbies: string[]
) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    console.log("Пользователь не найден для обновления:", id);
    return null;
  }

  users[userIndex] = { id, username, age, hobbies };
  console.log("Обновлен пользователь:", users[userIndex]);

  if (isMultiMode) {
    console.log("Отправка обновления пользователям...");
    process.send?.({ action: "UPDATE_DB", payload: users[userIndex] });
  }
  return users[userIndex];
};

export const deleteUser = (id: string) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    console.log("Пользователь не найден для удаления:", id);
    return false;
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  console.log("Удален пользователь:", deletedUser);

  if (isMultiMode) {
    console.log("Отправка уведомления о удалении пользователям...");
    process.send?.({ action: "UPDATE_DB", payload: null });
  }
  return true;
};
