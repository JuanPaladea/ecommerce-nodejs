const supertest = require('supertest');
const {faker} = require('@faker-js/faker');

const request = supertest("http://localhost:3000");

let token = ""
let email = faker.internet.email()
let password = faker.internet.password()

describe("API Users", () => {
  it("should register a new user", async () => {
    const response = await request.post("/api/users/register").send({
      name: faker.person.fullName(),
      email: email,
      password: password,
    });

    expect(response.status).toBe(201);
  });

  it("should try to register a new user without complete data", async () => {
    const response = await request.post("/api/users/register").send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });

    expect(response.status).toBe(400);
  });

  it("should try to register a user that already exists", async () => {
    const response = await request.post("/api/users/register").send({
      name: faker.person.fullName(),
      email: email,
      password: faker.internet.password(),
    });

    expect(response.status).toBe(500);
  });

  it("should try to register a new user with an invalid email", async () => {
    const response = await request.post("/api/users/register").send({
      name: faker.person.fullName(),
      email: "invalid-email",
      password: faker.internet.password(),
    });

    expect(response.status).toBe(400);
  });

  it("should try to register a new user with a password that is too short", async () => {
    const response = await request.post("/api/users/register").send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "123",
    });

    expect(response.status).toBe(400);
  });

  it("should try to login with an invalid email", async () => {
    const response = await request.post("/api/users/login").send({
      email: "invalid-email",
      password: password,
    });

    expect(response.status).toBe(400);
  });

  it("should try to login with an invalid password", async () => {
    const response = await request.post("/api/users/login").send({
      email: email,
      password: "Invalid-password123",
    });

    expect(response.status).toBe(401);
  });

  it("should login with the registered user", async () => {
    const response = await request.post("/api/users/login").send({
      email: email,
      password: password,
    });

    token = response.body.token;

    expect(response.status).toBe(200);
  });

  it("should try to access a protected route without a token", async () => {
    const response = await request.delete("/api/users/");

    expect(response.status).toBe(401);
  });

  it("should delete the registered user", async () => {
    const response = await request.delete("/api/users/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});