import { Request, Response } from 'express';
import { NewsArticle } from '../../models/NewsArticle';

export const publishNews = async (req: Request, res: Response) => {
  const { title, content, category, images, wallet_address } = req.body;

  try {
    const newArticle = await NewsArticle.create({
      title,
      content,
      category,
      images,
      wallet_address,
      timestamp: new Date()
    });

    res.status(201).json({
      message: "News published successfully.",
      news: newArticle
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to publish news." });
  }
};
