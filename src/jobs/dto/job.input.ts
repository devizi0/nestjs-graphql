import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateJobInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  location?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  salary?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  employmentType?: string;

  @Field({ nullable: true })
  @IsOptional()
  deadline?: Date;

  @Field(() => ID)
  @IsUUID()
  companyId: string;
}

@InputType()
export class UpdateJobInput extends PartialType(CreateJobInput) {}
