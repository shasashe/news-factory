// src/routes/api/getUserDetails/+server.ts
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

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { access_token } = await request.json();
    if (!access_token) {
      return new Response(JSON.stringify({ success: false, error: 'No access token provided' }), { status: 400 });
    }

    const userId = getUserIdFromToken(access_token);

    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: { walletId: user.walletAddress, address: user.walletAddress } }), { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return new Response(JSON.stringify({ success: false, error: 'Error fetching user details' }), { status: 500 });
  }
};
