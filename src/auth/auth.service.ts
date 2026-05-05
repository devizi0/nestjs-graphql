import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginInput, RegisterInput } from './dto/auth.input';
import { AuthPayload } from './dto/auth.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthPayload> {
    console.log('register input:', JSON.stringify(input));
    const exists = await this.userRepo.findOne({ where: { email: input.email } });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(input.password, 10);
    const user = this.userRepo.create({
      email: input.email,
      name: input.name,
      password: hashed,
    });
    await this.userRepo.save(user);

    return this.buildPayload(user);
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.userRepo.findOne({
      where: { email: input.email },
      select: ['id', 'email', 'name', 'password', 'profileImage', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    console.log('login user.password:', user.password ? 'exists' : 'undefined');
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildPayload(user);
  }

  private buildPayload(user: User): AuthPayload {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken, user };
  }
}
