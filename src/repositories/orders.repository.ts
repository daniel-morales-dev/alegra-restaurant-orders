import Container, { Service } from "typedi";
import { DataSource, MongoRepository } from "typeorm";
import { Orders } from "../models/orders.model";

@Service()
export class OrdersRepository extends MongoRepository<Orders> {
  constructor() {
    const dataSource = Container.get<DataSource>("AppDataSourceMongoDB");
    super(Orders, dataSource.createEntityManager());
  }
}
