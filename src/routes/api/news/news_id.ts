import { Request, Response } from 'express';
import { NewsArticle } from '../../models/NewsArticle';

export const getNewsDetails = async (req: Request, res: Response) => {
  const { news_id } = req.params;

  try {
    const news = await NewsArticle.findByPk(news_id);

    if (!news) {
      return res.status(404).json({ error: "News not found." });
    }

    res.status(200).json({ news });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news details." });
  }
};
