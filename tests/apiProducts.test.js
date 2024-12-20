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
})

describe("API Products", () => {
  it("should return a list of products", async () => {
    const response = await request.get("/api/products").set("Authorization", `Bearer ${token}`)

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
    }).set("Authorization", `Bearer ${token}`)

    productId = response.body._id

    expect(response.status).toBe(201)
  })

  it("should return a product", async () => {
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
    }).set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it("should delete a product", async () => {
    const response = await request.delete(`/api/products/${productId}`).set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
  })
})