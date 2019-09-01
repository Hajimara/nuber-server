import bcrypt from "bcrypt";
import { IsEmail } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany
} from "typeorm";
import Chat from "./Chat";
import Message from "./Message";
import Ride from "./Ride";
import Place from "./Place";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: "text", nullable: true })
  @IsEmail()
  email: string | null;

  @Column({ type: "boolean", default: false })
  verifiedEmail: boolean;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: true })
  phoneNumber: string;

  @Column({ type: "boolean", default: false })
  verifiedPhoneNumber: boolean;

  @Column({ type: "text" })
  profilePhoto: string;

  @ManyToOne(type => Chat, chat => chat.participants)
  chat: Chat;

  @OneToMany(type => Message, message => message.user)
  messages: Message[];

  @OneToMany(type => Ride, ride => ride.passenger)
  ridesAsPassenger: Ride[];

  @OneToMany(type => Ride, ride => ride.driver)
  ridesAsDriver: Ride[];

  @OneToMany(type=>Place, place => place.user)
  places:Place[];

  @Column({ type: "boolean", default: false })
  isDriving: boolean;

  @Column({ type: "boolean", default: false })
  isRiding: boolean;

  @Column({ type: "boolean", default: false })
  isTaken: boolean;

  @Column({ type: "double precision", default: 0 })
  lastLng: number;

  @Column({ type: "double precision", default: 0 })
  lastLat: number;

  @Column({ type: "double precision", default: 0 })
  lastOrientation: number;

  @Column({ type: "text", nullable: true })
  fbId: string;

  @CreateDateColumn()
  createAt: string;

  @UpdateDateColumn()
  updateAt: string;

  get fullName(): string {
    return `${this.firstName} + ${this.lastName}`;
  }

  public comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
  // insert와 update 하기 전 이 메소드를 불러와
  // 타겟을 암호화 시킨다.
  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      const hashedPassword = await this.hashPassword(this.password);
      this.password = hashedPassword;
    }
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
}
export default User;
