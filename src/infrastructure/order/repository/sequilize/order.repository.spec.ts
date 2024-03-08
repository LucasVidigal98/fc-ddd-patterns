import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

async function startOrder() {
  const customerRepository = new CustomerRepository();
  const customer = new Customer("123", "Customer 1");
  const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
  customer.changeAddress(address);
  await customerRepository.create(customer);

  const productRepository = new ProductRepository();
  const product = new Product("123", "Product 1", 10);
  await productRepository.create(product);

  const orderItem = new OrderItem(
    "1",
    product.name,
    product.price,
    product.id,
    2
  );

  const order = new Order("123", "123", [orderItem]);

  const orderRepository = new OrderRepository();
  await orderRepository.create(order);

  return order;
}

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it('should be able to find a order', async () => {
    const order = await startOrder();

    const orderRepository = new OrderRepository();

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toBeDefined();

    expect(foundOrder).toEqual(order);
  });

  it('should be able to find all orders', async () => {
    const order = await startOrder();

    const orderRepository = new OrderRepository();

    const allOrders = await orderRepository.findAll();

    expect(allOrders).toHaveLength(1);

    expect(allOrders[0]).toEqual(order);
  });

  it('should be able to update a order', async () => {
    const order = await startOrder();

    const productRepository = new ProductRepository();
    const product = new Product("1234", "Product 2", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      2
    );

    order.insertNewitem(orderItem);

    const orderRepository = new OrderRepository();

    await orderRepository.update(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder.total).toEqual(order.total);

    expect(foundOrder).toEqual(order);
  });
});
