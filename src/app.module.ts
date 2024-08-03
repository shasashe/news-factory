import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './controllers/news.module';
import { NewspaperModule } from './controllers/newspaper.module';
import { UsersModule } from './controllers/users.module';

@Module({
  imports: [ConfigModule, AuthModule, NewsModule, NewspaperModule, UsersModule],
})
export class AppModule {}
