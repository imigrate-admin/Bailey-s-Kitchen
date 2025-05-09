import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { sub: user.id, email: user.email };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.usersService.findByEmail(email);
    
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user;
    
    const payload = { sub: user.id, email: user.email };
    
    return {
      user: result,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    const { password, ...result } = user;
    return result;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    
    // Don't reveal if the email exists or not for security
    if (!user) {
      return { success: true, message: 'If your email exists in our system, you will receive a password reset link.' };
    }
    
    // In a real implementation, generate token and send email
    // const token = this.generatePasswordResetToken();
    // await this.usersService.savePasswordResetToken(user.id, token);
    // await this.emailService.sendPasswordResetEmail(user.email, token);
    
    return {
      success: true,
      message: 'If your email exists in our system, you will receive a password reset link.'
    };
  }
}
