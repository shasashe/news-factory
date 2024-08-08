import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const getUserIdFromRequest = (request: Request): number | null => {
  const authHeader = request.headers.get('Authorization');

  console.log('Authorization header:', authHeader); // Check if the header is being received

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('No or invalid Authorization header provided');
    return null;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodedToken = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU3MjMwOTMsImlhdCI6MTcyMzEzMTA5MywiaXNzIjoiaHR0cHM6Ly9uZXVjcm9uLmlvIiwianRpIjoiMzVhODI2OWQtMWFlNS00YTg1LTkzNjItODFhMmRjNWI2MGY3IiwibmJmIjoxNzIzMTMxMDkzLCJzdWIiOiJlODY5MDE5Mi1mZWUxLTQ5OGYtOGRmZS00NmY0NWEwMjYwYTAiLCJ1c2VyX2lkIjoiZTg2OTAxOTItZmVlMS00OThmLThkZmUtNDZmNDVhMDI2MGEwIn0.rF7o7Aq_0Oe-qRlGWBF9sxZrz0RqROgDyQnaCCDf08I') as { userId: number };
    return decodedToken.userId;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const GET: RequestHandler = async ({ request }) => {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ walletAddress: user.walletAddress }), { status: 200 });
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    return new Response(JSON.stringify({ error: "Error fetching wallet address" }), { status: 500 });
  }
};
