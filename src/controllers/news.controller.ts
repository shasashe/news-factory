import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NewsService } from '../services/news.service';
import { CreateNewsDto } from '../models/dto/create-news.dto';

@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('publish')
  async publishNews(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.publishNews(createNewsDto);
  }

  @Get('feed')
  async getNewsFeed() {
    return this.newsService.getNewsFeed();
  }

  @Get(':news_id')
  async getNewsDetails(@Param('news_id') news_id: string) {
    return this.newsService.getNewsDetails(news_id);
  }
}
