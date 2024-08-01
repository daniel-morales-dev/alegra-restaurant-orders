import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";
import { Transform } from "class-transformer";
import { ObjectId } from "mongodb";
import { Recipes } from "../interfaces/domain/recipes.model";

@Entity("orders")
export class Orders {
  @ObjectIdColumn()
  @Transform((input) => input.value.toHexString(), { toPlainOnly: true })
  _id: ObjectId;

  @Column()
  uuid: string;

  @Column()
  recipe: Recipes;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  insertCreated() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  insertUpdated() {
    this.updated_at = new Date();
  }
}
