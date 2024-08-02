import NeucronSDK from 'neucron-sdk';
import prisma from './database';

export const actions = {
  login: async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    try {
      // Perform login
      const loginResponse = await authModule.login({ email, password });
      console.log(loginResponse);

      // Retrieve wallet address and balance
      const addresses = await walletModule.getAddressesByWalletId({});
      const balance = await walletModule.getWalletBalance({});

      // Update user data in the database
      const user = await prisma.user.upsert({
        where: { email },
        update: { walletAddress: addresses.data.addresses[0] },
        create: {
          email,
          password,
          walletAddress: addresses.data.addresses[0]
        }
      });
      console.log('User login data saved to database:', user);

      return {
        success: true,
        address: addresses.data.addresses[0],
        balance: balance.data.balance.summary
      };
    } catch (err) {
      console.error('Error during login process:', err);
      return { success: false, error: 'Error during login process' };
    }
  },

  signup: async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    try {
      // Sign up user
      const signUpResponse = await authModule.signUp({ email, password });
      console.log(signUpResponse);

      // Retrieve wallet address
      const addresses = await walletModule.getAddressesByWalletId({});
      console.log(addresses);

      // Insert user data into the database
      const user = await prisma.user.create({
        data: {
          email,
          password,
          walletAddress: addresses.data.addresses[0]
        }
      });
      console.log('User signup data saved to database:', user);

      return { success: true };
    } catch (err) {
      console.error('Error during signup process:', err);
      return { success: false, error: 'Error during signup process' };
    }
  },
};
