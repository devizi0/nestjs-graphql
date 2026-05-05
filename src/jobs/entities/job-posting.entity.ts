import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@ObjectType()
@Entity('job_postings')
export class JobPosting {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  salary?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  employmentType?: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  deadline?: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Company)
  @ManyToOne(() => Company, (company) => company.jobPostings, { eager: true })
  company: Company;

  @Column()
  companyId: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string | null;
}
