import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { CreateChatRoomInput, SendMessageInput } from './dto/chat.input';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query(() => [ChatRoom])
  chatRooms(@Args('companyId', { type: () => ID, nullable: true }) companyId?: string) {
    return this.chatService.findAllRooms(companyId);
  }

  @Query(() => [Message])
  @UseGuards(JwtAuthGuard)
  messages(@Args('chatRoomId', { type: () => ID }, ParseUUIDPipe) chatRoomId: string) {
    return this.chatService.getMessages(chatRoomId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ChatRoom)
  createChatRoom(@CurrentUser() user: User, @Args('input') input: CreateChatRoomInput) {
    return this.chatService.createRoom(input, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  deleteChatRoom(@CurrentUser() user: User, @Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.chatService.deleteRoom(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message)
  sendMessage(@CurrentUser() user: User, @Args('input') input: SendMessageInput) {
    return this.chatService.saveMessage(user.id, input);
  }
}
