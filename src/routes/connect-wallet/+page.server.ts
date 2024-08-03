import NeucronSDK from 'neucron-sdk';
import prisma from './database';

export const actions = {
  login: async ({ request }: { request: Request }) => {
    const data = await request.formData();

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    const loginResponse = await authModule.login({ email: data.get('email') as string, password: data.get('password') as string });
    console.log(loginResponse);

    const DefaultWalletBalance = await walletModule.getWalletBalance({});
    console.log(DefaultWalletBalance);

    const addresses = await walletModule.getAddressesByWalletId({});
    console.log(addresses);

    // Insert the login data into the database
    try {
      const user = await prisma.user.upsert({
        where: { email: data.get('email') as string },
        update: {
          password: data.get('password') as string,
          walletAddress: addresses.data.addresses[0] as string
        },
        create: {
          email: data.get('email') as string,
          password: data.get('password') as string,
          walletAddress: addresses.data.addresses[0] as string
        }
      });
      console.log('User logged in data saved to database:', user);
    } catch (err) {
      console.error('Database error:', err);
    }

    return { success: true, address: addresses.data.addresses[0], balance: DefaultWalletBalance.data.balance.summary };
  },

  signup: async ({ request }: { request: Request }) => {
    const data = await request.formData();

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;

    const signUpResponse = await authModule.signUp({ email: data.get('email') as string, password: data.get('password') as string });
    console.log(signUpResponse);

    // Insert the signup data into the database
    try {
      const user = await prisma.user.create({
        data: {
          email: data.get('email') as string,
          password: data.get('password') as string
        }
      });
      console.log('User signup data saved to database:', user);
    } catch (err) {
      console.error('Database error:', err);
    }

    return { success: true };
  },
};