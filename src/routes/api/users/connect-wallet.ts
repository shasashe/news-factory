import { Request, Response } from 'express';
import { User } from '../../models/User';

export const connectWallet = async (req: Request, res: Response) => {
  const { wallet_address } = req.body;

  try {
    const user = await User.create({ wallet_address, status: 'connected' });

    res.status(201).json({
      message: "Wallet connected successfully.",
      user
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to connect wallet." });
  }
};
