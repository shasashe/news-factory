import NeucronSDK from 'neucron-sdk';
import { PrismaClient } from '@prisma/client';
import type { Actions } from '@sveltejs/kit';

// Interface for login response
interface LoginResponse {
  data: {
    access_token: string;
    expiresAt: string;
    message: string;
  };
  status_code: number;
}

// Interface for wallet balance response
interface WalletBalanceResponse {
  data: {
    balance: {
      confirmed: number;
      unconfirmed: number;
      summary: number;
      count: number;
    };
  };
  status_code: number;
}

// Interface for wallet addresses response
interface WalletAddressesResponse {
  data: {
    addresses: string[];
  };
  status_code: number;
}


const prisma = new PrismaClient();

export const actions: Actions = {
  login: async ({ request }) => {
    const data = await request.formData();

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    try {
      // Perform login and get the response
      const loginResponse: unknown = await authModule.login({
        email: data.get('email') as string,
        password: data.get('password') as string,
      });

      // Type assertion to ensure loginResponse conforms to LoginResponse
      const response = loginResponse as LoginResponse;
      console.log('Login Response:', response);

      // Extract token from response
      const token = response.data.access_token;

      // Get the wallet balance
      const walletBalanceResponse: unknown = await walletModule.getWalletBalance({});
      const walletBalance = walletBalanceResponse as WalletBalanceResponse;
      console.log('Wallet Balance:', walletBalance);

      // Get wallet addresses
      const addressesResponse: unknown = await walletModule.getAddressesByWalletId({});
      const addresses = addressesResponse as WalletAddressesResponse;
      console.log('Addresses:', addresses);

      // Ensure we have at least one address
      if (addresses.data.addresses.length === 0) {
        throw new Error('No wallet addresses found');
      }

      // Upsert the user in the database
      const user = await prisma.user.upsert({
        where: { email: data.get('email') as string },
        update: {
          password: data.get('password') as string,
          walletAddress: addresses.data.addresses[0] as string,
        },
        create: {
          email: data.get('email') as string,
          password: data.get('password') as string,
          walletAddress: addresses.data.addresses[0] as string,
        },
      });
      console.log('User logged in data saved to database:', user);

      // Return the response with the token and wallet info
      return {
        success: true,
        address: addresses.data.addresses[0],
        balance: walletBalance.data.balance.summary,
        token, // Include the token in the response
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  },

  signup: async ({ request }) => {
    const data = await request.formData();

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;

    try {
      // Perform signup
      const signUpResponse: unknown = await authModule.signUp({
        email: data.get('email') as string,
        password: data.get('password') as string,
      });
      console.log('Signup Response:', signUpResponse);

      // Create a new user with a placeholder wallet address (to be updated later)
      const user = await prisma.user.create({
        data: {
          email: data.get('email') as string,
          password: data.get('password') as string,
          walletAddress: 'PLACEHOLDER_WALLET_ADDRESS', // Placeholder value
        },
      });
      console.log('User signup data saved to database:', user);

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed' };
    }
  },
};
