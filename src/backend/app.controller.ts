import { Controller, Get, Post, UseGuards, Req, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PrismaService } from './prisma.service';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    walletAddress: string;
  };
}

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('api/user-wallet')
  async getWalletAddress(@Req() req: RequestWithUser) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { walletAddress: user.walletAddress };
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/news')
  async createNews(@Req() req: RequestWithUser, @Body() body: any) {
    const { title, content, category, image } = body;

    if (!title || !content || !category) {
      throw new BadRequestException('Title, content and category are required');
    }

    const newsArticle = await this.prisma.newsArticle.create({
      data: {
        title,
        content,
        category,
        image,
        userWallet: req.user.walletAddress,
        userId: req.user.id,
      },
    });

    return newsArticle;
  }
}
