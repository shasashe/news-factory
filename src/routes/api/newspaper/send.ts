import { Request, Response } from 'express';
import { sendDailyNewspaper } from '../../services/newspaperService';

export const sendDailyNewspaper = async (req: Request, res: Response) => {
  const { wallet_addresses, date } = req.body;

  try {
    await sendDailyNewspaper(wallet_addresses, date);

    res.status(200).json({
      message: "Daily newspaper sent successfully to all connected wallets."
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to send daily newspaper." });
  }
};
