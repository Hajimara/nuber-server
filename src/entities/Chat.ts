import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  ManyToOne,
  OneToOne
} from "typeorm";
import Message from "./Message";
import User from "./User";
import Ride from "./Ride";

@Entity()
class Chat extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @OneToMany(type => Message, message => message.chat)
  messages: Message[];

  @ManyToOne(type => User, user => user.chatsAsPassenger)
  passenger: User;

  @OneToMany(type => User, user => user.chat)
  participants: User[];

  @Column({ nullable: true })
  passengerId: number;

  @ManyToOne(type => User, user => user.chatsAsDriver)
  driver: User;

  @Column({ nullable: true })
  driverId: number;
  
  @OneToOne(type => Ride, ride => ride.chat)
  ride: Ride;

  @Column({nullable: true})
  rideId: number;

  @CreateDateColumn() createAt: string;
  @CreateDateColumn() updateAt: string;
}

export default Chat;
