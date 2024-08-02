import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserEmail } from '../common/decorator/user-email.decorator';


@Module({
  imports:[DatabaseModule, AuthModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}