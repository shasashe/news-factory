import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from '../models/dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async publishNews(createNewsDto: CreateNewsDto) {
    return this.prisma.newsArticle.create({
      data: {
        ...createNewsDto,
        images: { set: createNewsDto.images },
      },
    });
  }

  async getNewsFeed() {
    return this.prisma.newsArticle.findMany();
  }

  async getNewsDetails(news_id: string) {
    return this.prisma.newsArticle.findUnique({
      where: { id: news_id },
      include: { Comments: true },
    });
  }
}
