import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

// TypeScript interface for the request body in POST requests
interface NewsArticlePayload {
  title: string;
  content: string;
  category: string;
  image?: string;
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
    console.error("Error fetching news:", error);
    return new Response(JSON.stringify({ error: "Error fetching news" }), { status: 500 });
  }
};

// POST request handler
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { title, content, category, image }: NewsArticlePayload = await request.json();

    if (!title || !content || !category) {
      return new Response(JSON.stringify({ error: "Title, content, and category are required." }), { status: 400 });
    }

    // Ensure the category exists
    let categoryRecord = await prisma.category.findUnique({ where: { name: category } });
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({ data: { name: category } });
    }

    // Create the article
    const newArticle = await prisma.newsArticle.create({
      data: {
        title,
        content,
        image: image || null,
        category: { connect: { id: categoryRecord.id } },
        likes: 0,
        createdAt: new Date(),
        comments: { create: [] },
        commentsCount: 0
      }
    });

    return new Response(JSON.stringify(newArticle), { status: 201 });
  } catch (error) {
    console.error("Error creating news article:", error);
    return new Response(JSON.stringify({ error: "Error creating news article" }), { status: 500 });
  }
};
