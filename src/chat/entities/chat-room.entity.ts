import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Message } from './message.entity';

@ObjectType()
@Entity('chat_rooms')
export class ChatRoom {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Company)
  @ManyToOne(() => Company, (company) => company.chatRooms, { eager: true })
  company: Company;

  @Column()
  companyId: string;

  @Column({ type: 'varchar', nullable: true })
  ownerId: string | null;

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
