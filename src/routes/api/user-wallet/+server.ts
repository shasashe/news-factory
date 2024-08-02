// src/routes/api/user-wallet/+server.ts
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || 'your-default-secret';

const getUserIdFromToken = (token: string): number | null => {
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    return decoded.user_id; // Adjust based on your token payload structure
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const GET: RequestHandler = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ walletAddress: user.walletAddress }), { status: 200 });
  } catch (error) {
    console.error('Error fetching wallet address:', error);
    return new Response(JSON.stringify({ error: 'Error fetching wallet address' }), { status: 500 });
  }
};
