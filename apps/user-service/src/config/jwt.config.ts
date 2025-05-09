import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_SECRET', 'your-super-secret-jwt-key-that-should-be-long-and-secure'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
  },
});

