import { PrismaClient } from '@prisma/client';
import jwt, { type Secret } from 'jsonwebtoken';
import NeucronSDK from 'neucron-sdk';
import type { RequestHandler } from '@sveltejs/kit';




interface NewsArticlePayload {
  title: string;
  content: string;
  category: string;
  image?: string;
  userWallet: string;
}

// Middleware to verify JWT token
const prisma = new PrismaClient();
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallbackSecret';

interface NewsArticlePayload {
  title: string;
  content: string;
  category: string;
  image?: string;
  userWallet: string;
}

// Middleware to verify JWT token
async function verifyJWT(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set.');
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return decoded.email as string | null;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}


// GET request handler
export const GET: RequestHandler = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    const date = url.searchParams.get('date');
    const popularity = url.searchParams.get('popularity');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');

    let whereClause: any = {};

    if (category) whereClause.category = { name: category };
    if (date) whereClause.createdAt = { gte: new Date(date) };
    if (popularity) whereClause.popularity = popularity;

    const newsArticles = await prisma.newsArticle.findMany({
      where: whereClause,
      include: { category: true, comments: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    return new Response(JSON.stringify(newsArticles), { status: 200 });
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(JSON.stringify({ error: 'Error fetching news' }), { status: 500 });
  }
};

// POST request handler
export const POST: RequestHandler = async ({ request }) => {
  try {
    const email = await verifyJWT(request);
    if (!email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { title, content, category, image, userWallet }: NewsArticlePayload = await request.json();

    if (!title || !content || !category || !userWallet) {
      return new Response(JSON.stringify({ error: 'Title, content, category, and user wallet are required.' }), { status: 400 });
    }

    let categoryRecord = await prisma.category.findUnique({ where: { name: category } });
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({ data: { name: category } });
    }

    const newArticle = await prisma.newsArticle.create({
      data: {
        title,
        content,
        image: image || null,
        category: { connect: { id: categoryRecord.id } },
        likes: 0,
        createdAt: new Date(),
        comments: { create: [] },
        commentsCount: 0,
        userWallet,
      },
    });

    const transactionData = {
      walletId: userWallet,
      data: `Article ID: ${newArticle.id}`,
      metadata: `Published news article with title: ${title}`,
    };

    const neucron = new NeucronSDK();
    const transactionModule = neucron.transactionModule || neucron.transaction;

    if (transactionModule && typeof transactionModule.createTransaction === 'function') {
      const transactionResponse = await transactionModule.createTransaction(transactionData);
      const transactionLink = transactionResponse.data.transactionLink;

      return new Response(JSON.stringify({ ...newArticle, transactionLink }), { status: 201 });
    } else {
      console.error('Transaction module or createTransaction method not found.');
      return new Response(JSON.stringify({ ...newArticle, transactionLink: 'Transaction failed: Manual step needed' }), { status: 201 });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating news article:', error.message);
      return new Response(JSON.stringify({ error: `Error creating news article: ${error.message}` }), { status: 500 });
    } else {
      console.error('Unknown error occurred:', error);
      return new Response(JSON.stringify({ error: 'An unknown error occurred' }), { status: 500 });
    }
  }
};
