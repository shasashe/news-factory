import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NewspaperService } from '../services/newspaper.service';
import { SendNewspaperDto } from '../models/dto/send-newspaper.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('newspaper')
export class NewspaperController {
  constructor(private readonly newspaperService: NewspaperService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendDailyNewspaper(@Body() sendNewspaperDto: SendNewspaperDto) {
    return this.newspaperService.sendDailyNewspaper(sendNewspaperDto);
  }
}
