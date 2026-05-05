import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCompanyInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  logoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  industry?: string;
}

@InputType()
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {}
