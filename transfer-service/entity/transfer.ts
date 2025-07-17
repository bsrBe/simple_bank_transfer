import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  senderId!: string;

  @Column()
  receiverId!: string;

  @Column("float")
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
