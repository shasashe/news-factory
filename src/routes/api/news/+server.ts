import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";
import NeucronSDK from 'neucron-sdk'; // Default import for NeucronSDK

const prisma = new PrismaClient();
const neucron = new NeucronSDK(); // Initialize Neucron SDK

interface NewsArticlePayload {
  title: string;
  content: string;
  category: string; // Category name
  image?: string;
  userWallet: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { title, content, category, image, userWallet }: NewsArticlePayload = await request.json();

    if (!title || !content || !category || !userWallet) {
      return new Response(JSON.stringify({ error: "Title, content, category, and user wallet are required." }), { status: 400 });
    }

    // Ensure the category exists
    let categoryRecord = await prisma.category.findUnique({ where: { name: category } });
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({ data: { name: category } });
    }

    // Retrieve the user based on the wallet address
    const user = await prisma.user.findUnique({ where: { walletAddress: userWallet } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 400 });
    }

    // Create the article
    const newArticle = await prisma.newsArticle.create({
      data: {
        title,
        content,
        image: image || null,
        category, // Link to category by ID
        userId: user.id, // Link to the user
        createdAt: new Date(),
        updatedAt: new Date(),
        commentsCount: 0,
      },
    });

    // Publish the transaction on the blockchain
    await neucron.publishArticle({
      title,
      content,
      category,
      image,
      userWallet,
      articleId: newArticle.id,
    });

    return new Response(JSON.stringify(newArticle), { status: 201 });
  } catch (error) {
    console.error("Error creating news article:", error);
    return new Response(JSON.stringify({ error: "Error creating news article" }), { status: 500 });
  }
};
