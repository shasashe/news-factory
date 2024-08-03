import { Request, Response } from 'express';
import { User } from '../../models/User';

export const getProfile = async (req: Request, res: Response) => {
  const { wallet_address } = req.query;

  try {
    const user = await User.findOne({ where: { wallet_address } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};
