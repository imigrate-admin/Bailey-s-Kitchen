import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
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
    
    // Generate a random reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Hash the token before saving it
    const hashedToken = await bcrypt.hash(resetToken, 10);
    
    // Save the hashed token and expiry
    await this.usersService.savePasswordResetToken(user.id, hashedToken, resetTokenExpiry);
    
    try {
      // Send the reset email
      await this.emailService.sendPasswordResetEmail(email, resetToken);
      
      return {
        success: true,
        message: 'If your email exists in our system, you will receive a password reset link.'
      };
    } catch (error) {
      // If email fails, clean up the token
      await this.usersService.savePasswordResetToken(user.id, null, null);
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(resetToken: string, newPassword: string) {
    // Find user with valid reset token
    const user = await this.usersService.findByResetToken(resetToken);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      success: true,
      message: 'Password has been reset successfully'
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      success: true,
      message: 'Password has been changed successfully'
    };
  }
}
