import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existUserEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existUserEmail)
      throw new BadRequestException('user with this email already exists!');
    const existUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existUsername)
      throw new BadRequestException('user with this username already exists!');
    const user = await this.userRepository.save({
      email: createUserDto.email,
      username: createUserDto.username,
      password: await argon2.hash(createUserDto.password),
    });
    const token = this.jwtService.sign({ email: createUserDto.email });
    await this.userRepository.save(user);
    return { user, token };
  }
  async findOne(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
