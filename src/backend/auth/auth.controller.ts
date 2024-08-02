import { Controller, Post, Body, Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Controller('api')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  @Post('getUserDetails')
  async getUserDetails(@Body() body: { access_token: string }, @Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1] || body.access_token;

    try {
      // Verify and decode token
      const decoded = this.jwtService.verify(token);
      const userId = decoded.user_id;

      // Fetch user details from database
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      return { success: true, data: { walletId: user.walletAddress, address: user.walletAddress } };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      } else {
        return { success: false, error: 'Unknown error occurred' };
      }
    }
  }
}
