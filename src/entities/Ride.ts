import { rideStatus } from "src/types/types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from "typeorm";
import User from "./User";
import Chat from "./Chat";

@Entity()
class Ride extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: "text",
    enum: ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"],
    default: "REQUESTING"
  })
  status: rideStatus;

  @Column({ type: "text" })
  pickUpAddress: string;

  @Column({ type: "double precision", default: 0 })
  pickUpLat: number;

  @Column({ type: "double precision", default: 0 })
  pickUpLng: number;

  @Column({ nullable: true })
  passengerId: number;

  @Column({ nullable: true })
  driverId: number;

  @Column({ type: "text" })
  dropOffAddress: string;

  @Column({ type: "double precision", default: 0 })
  dropOffLat: number;

  @Column({ type: "double precision", default: 0 })
  dropOffLng: number;

  @Column({ type: "double precision" })
  price: number;

  @ManyToOne(type => User, user => user.ridesAsPassenger)
  passenger: User;

  @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
  driver: User;

  @Column({ type: "text" })
  distance: string;

  @Column({ type: "text" })
  duration: string;

  @OneToOne(type => Chat, chat => chat.ride)
  @JoinColumn()
  chat: Chat;
  // 위에 Ride 엔티티에 chat 필드랑 1:1 관계이고 @JoinColumn 어노테이션을 사용했다. 
  // 1:1  관계일 때 관계가 있는 두 대상은 동등한 관계가 아니다. 
  // Chat은 Ride에 소유되어 소속없이 존재 하지 않는다. Ride 가 Chat라는 것을 소유하는 형태인데 
  // 이때 @JoinColumn 어노테이션을 사용한다.

  @Column({nullable: true})
  chatId: number;
  
  @CreateDateColumn() createAt: string;
  @UpdateDateColumn() updateAt: string;
}

export default Ride;
