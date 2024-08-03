import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ConnectWalletDto } from '../models/dto/connect-wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('connect-wallet')
  @UseGuards(JwtAuthGuard)
  async connectWallet(@Body() connectWalletDto: ConnectWalletDto) {
    return this.usersService.connectWallet(connectWalletDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Query('wallet_address') wallet_address: string) {
    return this.usersService.getProfile(wallet_address);
  }
}
