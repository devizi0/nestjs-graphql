import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateChatRoomInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => ID)
  @IsUUID()
  companyId: string;
}

@InputType()
export class SendMessageInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => ID)
  @IsUUID()
  chatRoomId: string;
}
