import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ContactModule,
  ],
})
export class AppModule {} 