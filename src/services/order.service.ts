import { Service } from "typedi";
import { ICreateOrder } from "../interfaces/createOrder.interface";
import { OrdersRepository } from "../repositories/orders.repository";

@Service()
export class OrderService {
  constructor(private readonly orderRepository: OrdersRepository) {}
  async createOrder(order: ICreateOrder) {
    const newOrder = this.orderRepository.create(order);
    return await this.orderRepository.save(newOrder);
  }
}
