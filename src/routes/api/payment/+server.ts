
import type { RequestHandler } from "@sveltejs/kit";

import fetch from "node-fetch";

export const POST: RequestHandler = async ({ request }) => {
  const { amount } = await request.json();

  try {
    const paymentResponse = await fetch("https://api.opennode.co/v1/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENNODE_API_KEY}` // Replace with your OpenNode API key
      },
      body: JSON.stringify({
        amount: amount,
        currency: "sat",
        description: "Payment for publishing news article"
      })
    });

    const paymentData = await paymentResponse.json();
    if (!paymentResponse.ok) {
      return new Response(JSON.stringify({ error: paymentData.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ paymentId: paymentData.data.id }), { status: 200 });
  } catch (error) {
    console.error("Error processing payment:", error);
    return new Response(JSON.stringify({ error: "Error processing payment" }), { status: 500 });
  }
};