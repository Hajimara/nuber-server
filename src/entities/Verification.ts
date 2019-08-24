import { verificationTarget } from "../types/types";
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert
} from "typeorm";

const PHONE = "PHONE";
const EMAIL = "EMAIL";

@Entity()
class Verification extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text", enum: [EMAIL, PHONE] })
  target: verificationTarget;

  @Column({ type: "text" })
  payload: string;

  @Column({ type: "text" })
  key: string;

  @Column({ type: "boolean", default: false })
  used: boolean;

  @CreateDateColumn() createAt: string;
  @CreateDateColumn() updateAt: string;

  @BeforeInsert()
  createKey():void{
    if(this.target === PHONE){
      this.key = Math.floor(Math.random()* 1000).toString();
    }else if(this.target === EMAIL){
      this.key = Math.random().toString(36).substr(2);
    }
  }
}

export default Verification;
