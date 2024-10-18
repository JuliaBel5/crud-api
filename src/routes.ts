import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./users";
import { handleErrors } from "./errors";

export const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;
  const parsedUrl = parse(url!, true);
  const userId = parsedUrl.pathname?.split("/").pop();

  if (parsedUrl.pathname === "/api/users" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getAllUsers()));
  } else if (
    method === "GET" &&
    parsedUrl.pathname?.startsWith("/api/users/")
  ) {
    const user = getUserById(userId!);
    if (!user) {
      handleErrors(res, 404, "User not found");
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } else if (parsedUrl.pathname === "/api/users" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { username, age, hobbies } = JSON.parse(body);
        if (!username || typeof age !== "number" || !Array.isArray(hobbies)) {
          handleErrors(res, 400, "Invalid user data");
          return;
        }
        const newUser = createUser(username, age, hobbies);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      } catch {
        handleErrors(res, 400, "Invalid JSON");
      }
    });
  } else if (
    method === "PUT" &&
    parsedUrl.pathname?.startsWith("/api/users/")
  ) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { username, age, hobbies } = JSON.parse(body);
        const updatedUser = updateUser(userId!, username, age, hobbies);
        if (!updatedUser) {
          handleErrors(res, 404, "User not found");
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedUser));
      } catch {
        handleErrors(res, 400, "Invalid JSON");
      }
    });
  } else if (
    method === "DELETE" &&
    parsedUrl.pathname?.startsWith("/api/users/")
  ) {
    const isDeleted = deleteUser(userId!);
    if (!isDeleted) {
      handleErrors(res, 404, "User not found");
      return;
    }
    res.writeHead(204);
    res.end();
  } else {
    handleErrors(res, 404, "Not found");
  }
};
