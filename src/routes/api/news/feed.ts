import { Request, Response } from 'express';
import { NewsArticle } from '../../models/NewsArticle';

export const getNewsFeed = async (req: Request, res: Response) => {
  try {
    const newsFeed = await NewsArticle.findAll();

    res.status(200).json({ news_feed: newsFeed });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news feed." });
  }
};
