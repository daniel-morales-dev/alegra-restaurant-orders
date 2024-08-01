import { DataSource } from "typeorm";
import { resolve } from "path";
import Container from "typedi";

console.log("MIS MODELOS", resolve(__dirname, "../models/*{.ts,.js}"));

export const AppDataSourceMongoDB = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_HOST,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  retryWrites: true,
  entities: [resolve(__dirname, "../models/*{.ts,.js}")],
  migrations: [resolve(__dirname, "../migrations/*{.ts,.js}")],
  synchronize: false,
  logging: true,
});

Container.set("AppDataSourceMongoDB", AppDataSourceMongoDB);
