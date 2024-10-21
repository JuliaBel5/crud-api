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
  }
  console.log("Текущий список пользователей:", users, isMultiMode);
  return users;
};

export const getUserById = async (id: string) => {
  if (isMultiMode) {
    const syncedUsers = await syncUsersWithMaster();
    console.log("Поиск пользователя по ID:", id, syncedUsers);
    const user = syncedUsers.find((user) => user.id === id);
    if (!user) {
      console.log("Пользователь с таким ID не найден:", id);
    }
    console.log("user found", user);
    return user;
  }
  const user = users.find((user) => user.id === id);
  if (!user) {
    console.log("Пользователь с таким ID не найден:", id);
  }
  return user;
};

export const createUser = (
  username: string,
  age: number,
  hobbies: string[]
) => {
  const newUser = { id: uuidv4(), username, age, hobbies };

  if (isMultiMode) {
    console.log("Отправка обновления пользователям...");
    process.send?.({ action: "USER_CREATED", payload: newUser });
  }
  users.push(newUser);
  console.log("Создан новый пользователь:", users);
  return newUser;
};

export const updateUser = async (
  id: string,
  username: string,
  age: number,
  hobbies: string[]
) => {
  let syncedUsers: User[];

  if (isMultiMode) {
    syncedUsers = await syncUsersWithMaster();
  } else {
    syncedUsers = users;
  }

  const userIndex = syncedUsers.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    console.log("Пользователь не найден для обновления:", id);
    return null;
  }

  const updatedUser = { id, username, age, hobbies };
  syncedUsers[userIndex] = updatedUser;
  console.log("Обновлен пользователь:", updatedUser);

  if (isMultiMode) {
    process.send?.({ action: "UPDATE_DB", payload: updatedUser });
    console.log("Отправка обновления пользователям...");
  }

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  let syncedUsers: User[];

  if (isMultiMode) {
    syncedUsers = await syncUsersWithMaster();
  } else {
    syncedUsers = users;
  }

  const userIndex = syncedUsers.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    console.log("Пользователь не найден для удаления:", id);
    return false;
  }

  const deletedUser = syncedUsers.splice(userIndex, 1)[0];
  console.log("Удалён пользователь:", deletedUser);

  if (isMultiMode) {
    console.log("Отправка уведомления о удалении пользователям...");
    process.send?.({ action: "DELETE_USER", payload: id });
  }

  return true;
};
