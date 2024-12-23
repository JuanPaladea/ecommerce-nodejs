const supertest = require('supertest');
const {faker} = require('@faker-js/faker');

const request = supertest("http://localhost:3000");

let token = ""
let productId = ""

beforeAll(async () => {
  const response = await request.post("/api/users/login").send({
    email: "juanpaladea5@gmail.com",
    password: "Gallo1330"
  })

  token = response.body.token
  expect(response.status).toBe(200)
})

describe("API Products", () => {
  it("should return a list of products", async () => {
    const response = await request.get("/api/products")

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
  })

  it("should create a product", async () => {
    const response = await request.post("/api/products").set("Authorization", `Bearer ${token}`).send({
      sku: faker.number.int(6),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      shortDescription: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      tags: [faker.commerce.productMaterial()],
      price: faker.commerce.price(),
      stock: faker.number.int(50),
      isAvailable: true,
      images: [faker.image.url()]
    })

    productId = response.body._id

    expect(response.status).toBe(201)
  })

  it("should try to create a product without admin permissions", async () => {
    const response = await request.post("/api/products").send({
      sku: faker.number.int(6),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      shortDescription: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      tags: [faker.commerce.productMaterial()],
      price: faker.commerce.price(),
      stock: faker.number.int(50),
      isAvailable: true,
      images: [faker.image.url()]
    })

    expect(response.status).toBe(401)
  });

  it("should try to create a product with missing data", async () => {
    const response = await request.post("/api/products").set("Authorization", `Bearer ${token}`).send({
      sku: faker.number.int(6),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      tags: [faker.commerce.productMaterial()],
      price: faker.commerce.price(),
      stock: faker.number.int(50),
      isAvailable: true,
      images: [faker.image.url()]
    })

    expect(response.status).toBe(400)
  })

  it("should get a product by id", async () => {
    const response = await request.get(`/api/products/${productId}`).set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body._id).toBe(productId)
  })

  it("should update a product", async () => {
    const response = await request.put(`/api/products/${productId}`).set("Authorization", `Bearer ${token}`).send({
      sku: faker.number.int(6),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      shortDescription: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      tags: [faker.commerce.productMaterial()],
      price: faker.commerce.price(),
      stock: faker.number.int(50),
      isAvailable: true,
      images: [faker.image.url()]
    })

    expect(response.status).toBe(200)
  })

  it("should try to update a product without admin permissions", async () => {
    const response = await request.put(`/api/products/${productId}`).send({
      sku: faker.number.int(6),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      shortDescription: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      tags: [faker.commerce.productMaterial()],
      price: faker.commerce.price(),
      stock: faker.number.int(50),
      isAvailable: true,
      images: [faker.image.url()]
    })

    expect(response.status).toBe(401)
  });

  it("should delete a product", async () => {
    const response = await request.delete(`/api/products/${productId}`).set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it("should try to delete a product without admin permissions", async () => {
    const response = await request.delete(`/api/products/${productId}`)

    expect(response.status).toBe(401)
  });

  it("should try to delete a product with an invalid id", async () => {
    const response = await request.delete(`/api/products/123`).set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(400)
  })
})