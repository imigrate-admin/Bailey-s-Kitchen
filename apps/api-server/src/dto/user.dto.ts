import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  firstName: string = '';

  @IsString()
  @MinLength(2)
  lastName: string = '';

  @IsEmail()
  email: string = '';

  @IsString()
  @MinLength(6)
  password: string = '';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  constructor(partial?: Partial<CreateUserDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  constructor(partial?: Partial<UpdateUserDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

