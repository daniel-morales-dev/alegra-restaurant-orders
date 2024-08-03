import { Service } from "typedi";
import { ICreateOrder } from "../interfaces/createOrder.interface";
import { OrdersRepository } from "../repositories/orders.repository";
import { NotFoundError } from "routing-controllers";
import { In } from "typeorm";

@Service()
export class OrderService {
  constructor(private readonly orderRepository: OrdersRepository) {}

  async createOrder(order: ICreateOrder) {
    const newOrder = this.orderRepository.create(order);
    return await this.orderRepository.save(newOrder);
  }

  async getStatusOrder(uuid: string) {
    const order = await this.orderRepository.findOne({ where: { uuid } });
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async getMultipleStatusOrder(uuid: string[]) {
    return this.orderRepository.findByUuids(uuid);
  }

  async getTodayOrders() {
    return this.orderRepository.findOrdersTakenToday();
  }
}
