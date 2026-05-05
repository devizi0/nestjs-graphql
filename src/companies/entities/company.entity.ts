import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { JobPosting } from '../../jobs/entities/job-posting.entity';
import { ChatRoom } from '../../chat/entities/chat-room.entity';

@ObjectType()
@Entity('companies')
export class Company {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  ownerId: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  industry?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => JobPosting, (job) => job.company)
  jobPostings: JobPosting[];

  @OneToMany(() => ChatRoom, (room) => room.company)
  chatRooms: ChatRoom[];
}
