import Container, { Service } from "typedi";
import { DataSource, MongoRepository } from "typeorm";
import { Orders } from "../models/orders.model";

@Service()
export class OrdersRepository extends MongoRepository<Orders> {
  constructor() {
    const dataSource = Container.get<DataSource>("AppDataSourceMongoDB");
    super(Orders, dataSource.createEntityManager());
  }

  findByUuids(uuids: string[]) {
    if (!uuids) return [];
    return this.find({
      where: {
        uuid: {
          $in: uuids,
        },
      },
    });
  }

  async findOrdersTakenToday() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await this.find({
      where: {
        created_at: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    });

    return orders;
  }
}
