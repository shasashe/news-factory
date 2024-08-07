import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";
import fetch from "node-fetch";

const prisma = new PrismaClient();

interface NewsArticlePayload {
  title: string;
  content: string;
  category: string;
  image?: string;
  userWallet: string;
  paymentId: string; // Add paymentId to the payload
}

async function verifyPayment(paymentId: string) {
  const response = await fetch(`https://api.opennode.co/v1/charge/${paymentId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENNODE_API_KEY}` // Replace with your OpenNode API key
    }
  });

  const data = await response.json();
  return data.data.status === "paid";
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
    
    if (category) whereClause.category = category;
    if (date) whereClause.createdAt = { gte: new Date(date) };
    if (popularity) whereClause.popularity = parseInt(popularity);

    const newsArticles = await prisma.newsArticle.findMany({
      where: whereClause,
      include: { Comments: true, user: true },  // Include related comments and user
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    return new Response(JSON.stringify(newsArticles), { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return new Response(JSON.stringify({ error: "Error fetching news" }), { status: 500 });
  }
};

// POST request handler
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { title, content, category, image, userWallet, paymentId }: NewsArticlePayload = await request.json();

    if (!title || !content || !category || !userWallet || !paymentId) {
      return new Response(JSON.stringify({ error: "Title, content, category, user wallet, and payment ID are required." }), { status: 400 });
    }

    const paymentVerified = await verifyPayment(paymentId);
    if (!paymentVerified) {
      return new Response(JSON.stringify({ error: "Payment verification failed." }), { status: 400 });
    }

    const newArticle = await prisma.newsArticle.create({
      data: {
        title,
        content,
        category,
        image: image || null,
        likes: 0,
        commentsCount: 0,
        userWallet,
        createdAt: new Date()
      },
    });

    return new Response(JSON.stringify(newArticle), { status: 201 });
  } catch (error) {
    console.error("Error creating news article:", error);
    return new Response(JSON.stringify({ error: "Error creating news article" }), { status: 500 });
  }
};
