import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Ensure this is set in your environment variables
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AppController],
  providers: [JwtStrategy, PrismaService],
})
export class AppModule {}
