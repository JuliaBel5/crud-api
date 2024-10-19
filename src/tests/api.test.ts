import { server } from "../server";
import request from "supertest";

let createdUserId: string;
const newUser = {
  username: "testUser",
  age: 25,
  hobbies: ["reading", "gaming"],
};

beforeAll(async () => {
  server;
  const response = await request(server).post("/api/users").send(newUser);
  createdUserId = response.body.id;
});

afterAll((done) => {
  server.close(done);
});

describe("User API", () => {
  it("GET /api/users - should return users array", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
  });

  it("POST /api/users - should create a new user and return it", async () => {
    const anotherUser = {
      username: "testUser2",
      age: 25,
      hobbies: ["reading", "gaming"],
    };

    const response = await request(server).post("/api/users").send(anotherUser);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(anotherUser);
    expect(response.body.id).toBeDefined();
  });

  it("GET /api/users/{userId} - should return the created user by id", async () => {
    const userId = createdUserId;
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.username).toBe("testUser");
  });

  it("PUT /api/users/{userId} - should update the created user", async () => {
    const userId = createdUserId;
    const updatedUser = {
      username: "updatedUser",
      age: 30,
      hobbies: ["travelling"],
    };

    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedUser);
    expect(response.body.id).toBe(userId);
  });

  it("DELETE /api/users/{userId} - should delete the user", async () => {
    const userId = createdUserId;
    const response = await request(server).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
  });

  it("GET /api/users/{userId} - should return 404 for the deleted user", async () => {
    const userId = createdUserId;
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  //Для удобства - это тест для проверки неправильного формата данных
  it("POST /api/users - should return 400 for invalid user data", async () => {
    const invalidUser = {
      username: "",
      age: "notANumber",
      hobbies: "notAnArray",
    };

    const response = await request(server).post("/api/users").send(invalidUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid user data");
  });

  // Для удобства - это тест для проверки неправильного адреса запроса
  it("GET /api/invalid - should return 500 for invalid request", async () => {
    const response = await request(server).get("/api/invalid");
    expect(response.status).toBe(404);
  });

  it("GET /api/error - should return 500 for server error", async () => {
    const response = await request(server).get("/api/error");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
});
