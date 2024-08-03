import { API_BASE_URL } from './config';

export async function connectWallet(walletAddress: string) {
  const response = await fetch(`${API_BASE_URL}/users/connect-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
  return response.json();
}

export async function getProfile() {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
