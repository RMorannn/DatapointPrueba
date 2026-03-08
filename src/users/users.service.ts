import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userData: {
    email?: string;
    password?: string;
    name?: string;
  }): Promise<User> {
    const { email, password, name } = userData;

    if (!email || !password) {
      throw new BadRequestException('Email y password son obligatorios');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creamos un objeto plano primero
    const userToSave = {
      email,
      password: hashedPassword,
      name,
    };

    // Usamos el repositorio para guardar este objeto plano
    return await this.usersRepository.save(userToSave);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }
}
