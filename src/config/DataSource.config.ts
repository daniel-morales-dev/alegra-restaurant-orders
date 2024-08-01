import { DataSource } from "typeorm";
import { resolve } from "path";
import Container from "typedi";

export const AppDataSourceMongoDB = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_HOST,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  retryWrites: true,
  entities: [resolve("src/models/*{.ts,.js}")],
  migrations: [resolve("src/models/migrations/*{.ts,.js}")],
  synchronize: false,
  logging: true,
});

Container.set("AppDataSourceMongoDB", AppDataSourceMongoDB);
