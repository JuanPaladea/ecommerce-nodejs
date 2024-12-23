const supertest = require('supertest');
const {faker} = require('@faker-js/faker');

const request = supertest("http://localhost:3000");

let token = ""
let productId = ""
let orderId = ""

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

describe("API Orders", () => {
  it("should try to create an order without products", async () => {
    const response = await request.post("/api/orders").set("Authorization", `Bearer ${token}`).send({
      shippingInfo: {
        shippingAddress: {
          address: faker.location.streetAddress(),
          city: 'Buenos Aires',
          state: 'Buenos Aires',
          zipCode: faker.location.zipCode(),
        }, 
        shippingMethod: "Standard",
      },
      paymentMethod: "Credit Card"
    })

    expect(response.status).toBe(400)
  });

  it("should add a product to the cart", async () => {
    const response = await request.post("/api/carts").set("Authorization", `Bearer ${token}`).send({
      productId,
      quantity: 1
    })

    expect(response.status).toBe(201)
  });

  it("should create an order", async () => {
    const response = await request.post("/api/orders").set("Authorization", `Bearer ${token}`).send({
      shippingInfo: {
        shippingAddress: {
          address: faker.location.streetAddress(),
          city: 'Buenos Aires',
          state: 'Buenos Aires',
          zipCode: faker.location.zipCode(),
        }, 
        shippingMethod: "Standard",
      },
      paymentMethod: "Credit Card"
    })

    orderId = response.body._id
    expect(response.status).toBe(201)
  });

  it("should get all orders", async () => {
    const response = await request.get("/api/orders").set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(200)
  });

  it("should get an order by id", async () => {
    const response = await request.get(`/api/orders/${orderId}`).set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(200)
  });

  it("should update an order status", async () => {
    const response = await request.put(`/api/orders/${orderId}`).set("Authorization", `Bearer ${token}`).send({
      status: "Delivered"
    })
    expect(response.status).toBe(200)
  });

  it("should delete an order", async () => {
    const response = await request.delete(`/api/orders/${orderId}`).set("Authorization", `Bearer ${token}`)
    expect(response.status).toBe(200)
  });
});

afterAll(async () => {
  const response = await request.delete(`/api/products/${productId}`).set("Authorization", `Bearer ${token}`)
  expect(response.status).toBe(200)
})