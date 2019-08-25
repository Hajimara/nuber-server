import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import Chat from './Chat';
import User from './User';

@Entity()
class Message extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    @Column({type: "text"})
    text: string

    @ManyToOne(type=>Chat, chat => chat.messages)
    chat: Chat;

    @ManyToOne(type=>User, user=> user.messages)
    user: User;

    @Column({nullable: true })
    userId: number;

    @CreateDateColumn() createAt: string;
    @CreateDateColumn() updateAt: string;

}

export default Message;

// Message 클래스 정의에서 "다수의 Message 가 하나의 Chat과 관계를 가진다
// 그 다수의 메시지는 chat.messages" 이다.