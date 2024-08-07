import NeucronSDK from 'neucron-sdk';
import { PrismaClient } from '@prisma/client';
import type { Actions } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const actions: Actions = {
  login: async ({ request }) => {
    const data = await request.formData();

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    try {
      const loginResponse = await authModule.login({ email: data.get('email') as string, password: data.get('password') as string });
      console.log(loginResponse);

      const DefaultWalletBalance = await walletModule.getWalletBalance({});
      console.log(DefaultWalletBalance);

      const addresses = await walletModule.getAddressesByWalletId({});
      console.log(addresses);

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

      return {
        success: true,
        address: addresses.data.addresses[0],
        balance: DefaultWalletBalance.data.balance.summary,
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
      const signUpResponse = await authModule.signUp({ email: data.get('email') as string, password: data.get('password') as string });
      console.log(signUpResponse);

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
