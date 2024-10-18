import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

let users: User[] = [];

export const getAllUsers = () => users;

export const getUserById = (id: string) => users.find((user) => user.id === id);

export const createUser = (
  username: string,
  age: number,
  hobbies: string[]
) => {
  const newUser = { id: uuidv4(), username, age, hobbies };
  users.push(newUser);
  return newUser;
};

export const updateUser = (
  id: string,
  username: string,
  age: number,
  hobbies: string[]
) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;
  users[userIndex] = { id, username, age, hobbies };
  return users[userIndex];
};

export const deleteUser = (id: string) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return false;
  users.splice(userIndex, 1);
  return true;
};
