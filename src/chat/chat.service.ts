import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { CreateChatRoomInput, SendMessageInput } from './dto/chat.input';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private roomRepo: Repository<ChatRoom>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) {}

  findAllRooms(companyId?: string) {
    if (companyId) return this.roomRepo.find({ where: { companyId } });
    return this.roomRepo.find();
  }

  async findRoom(id: string) {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) throw new NotFoundException('Chat room not found');
    return room;
  }

  async createRoom(input: CreateChatRoomInput, ownerId: string) {
    const exists = await this.roomRepo.findOne({
      where: { name: input.name, companyId: input.companyId },
    });
    if (exists) throw new ConflictException('Chat room with this name already exists in the company');

    const room = this.roomRepo.create({ name: input.name, companyId: input.companyId, ownerId });
    const saved = await this.roomRepo.save(room);
    return this.findRoom(saved.id);
  }

  async deleteRoom(id: string, userId: string) {
    const room = await this.findRoom(id);
    if (room.ownerId && room.ownerId !== userId) throw new ForbiddenException('Not your chat room');
    await this.roomRepo.remove(room);
    return true;
  }

  async getMessages(chatRoomId: string) {
    await this.findRoom(chatRoomId);
    return this.messageRepo.find({
      where: { chatRoomId },
      order: { createdAt: 'ASC' },
    });
  }

  async saveMessage(userId: string, input: SendMessageInput): Promise<Message> {
    await this.findRoom(input.chatRoomId);

    if (!input.content.trim()) throw new BadRequestException('Message content cannot be empty');

    const message = this.messageRepo.create({
      content: input.content.trim(),
      chatRoomId: input.chatRoomId,
      userId,
    });
    const saved = await this.messageRepo.save(message);
    return this.messageRepo.findOne({ where: { id: saved.id } }) as Promise<Message>;
  }
}
