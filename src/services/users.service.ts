import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectWalletDto } from '../models/dto/connect-wallet.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async connectWallet(connectWalletDto: ConnectWalletDto) {
    return this.prisma.user.update({
      where: { walletAddress: connectWalletDto.wallet_address },
      data: { walletAddress: connectWalletDto.wallet_address },
    });
  }

  async getProfile(wallet_address: string) {
    return this.prisma.user.findUnique({
      where: { walletAddress: wallet_address },
      include: { NewsArticles: true, Comments: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
