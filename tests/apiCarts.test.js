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

  const product = await request.post("/api/products").set("Authorization", `Bearer ${token}`).send({
    sku: faker.number.int(6),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    shortDescription: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    brand: faker.company.name(),
    tags: [faker.commerce.productMaterial()],
    price: faker.commerce.price(),
    stock: 50,
    isAvailable: true,
    images: [faker.image.url()]
  })

  productId = product.body._id
  expect(product.status).toBe(201)
})

describe("API Carts", () => {
  it("should add a product to the cart", async () => {
    const response = await request.post("/api/carts").set("Authorization", `Bearer ${token}`).send({
      productId,
      quantity: 1
    })

    expect(response.status).toBe(201)
  })

  it("should try to add a product to the cart that does not exist", async () => {
    const response = await request.post("/api/carts").set("Authorization", `Bearer ${token}`).send({
      productId: faker.number.int(6),
      quantity: 1
    })

    expect(response.status).toBe(400)
  })

  it("should try to add a product to the cart with more quantity than stock", async () => {
    const response = await request.post("/api/carts").set("Authorization", `Bearer ${token}`).send({
      productId,
      quantity: 100
    })

    expect(response.status).toBe(400)
  })

  it("should get the cart", async () => {
    const response = await request.get("/api/carts").set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it("should update the quantity of a product in the cart", async () => {
    const response = await request.put("/api/carts").set("Authorization", `Bearer ${token}`).send({
      productId,
      quantity: 2
    })

    expect(response.status).toBe(200)
  });

  it("should try to update the quantity of a product in the cart that does not exist", async () => {
    const response = await request.put("/api/carts").set("Authorization", `Bearer ${token}`).send({
      productId: faker.number.int(6),
      quantity: 2
    })

    expect(response.status).toBe(400)
  });

  it("should try to update the quantity of a product in the cart with more quantity than stock", async () => {
    const response = await request.put("/api/carts").set("Authorization", `Bearer ${token}`).send({
      productId,
      quantity: 100
    })

    expect(response.status).toBe(400)
  });

  it("should delete a product from the cart", async () => {
    const response = await request.delete(`/api/carts/${productId}`).set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
  });

  it("should try to delete a product from the cart that does not exist", async () => {
    const response = await request.delete(`/api/carts/${faker.number.int(6)}`).set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(400)
  });

  it("should delete the cart", async () => {
    const response = await request.delete("/api/carts").set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
  });
})

afterAll(async () => {
  const response = await request.delete(`/api/products/${productId}`).set("Authorization", `Bearer ${token}`)
  expect(response.status).toBe(200)
})