// src/routes/api/auth/actions.ts
import NeucronSDK from 'neucron-sdk';
import prisma from '$lib/prisma';

interface LoginResponse {
  data: {
    access_token: string;
    expiresAt: string;
    message: string;
  };
  status_code: number;
}

interface SignupResponse {
  success: boolean;
  data?: {
    message: string;
  };
  error?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
}

export const actions = {
  login: async ({ request, fetch }): Promise<SuccessResponse<{ address: string; balance: number }> | ErrorResponse> => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    try {
      // Perform login
      const loginResponse = await authModule.login({ email, password }) as LoginResponse;
      console.log('Login response:', loginResponse);

      if (loginResponse.status_code !== 200) {
        throw new Error('Login failed');
      }

      // Extract token from response
      const { access_token } = loginResponse.data;

      // Call backend to get wallet ID and user details using the token
      const userResponse = await fetch('/api/getUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({ access_token })
      });

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user details: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      if (!userData.success) {
        throw new Error(userData.error);
      }

      const { walletId, address } = userData.data;

      // Retrieve wallet address and balance
      const addressesResponse = await walletModule.getAddressesByWalletId({ walletId });
      const balanceResponse = await walletModule.getWalletBalance({ walletId });

      if (!addressesResponse.data.addresses.length) {
        throw new Error('No addresses found');
      }

      // Update user data in the database
      const user = await prisma.user.upsert({
        where: { email },
        update: { walletAddress: addressesResponse.data.addresses[0] },
        create: {
          email,
          password, // Ensure this is hashed before saving
          walletAddress: addressesResponse.data.addresses[0]
        }
      });
      console.log('User login data saved to database:', user);

      return {
        success: true,
        data: {
          address: addressesResponse.data.addresses[0],
          balance: Number(balanceResponse.data.balance.summary) // Ensure balance is a number
        }
      };
    } catch (err) {
      console.error('Error during login process:', err instanceof Error ? err.message : 'Unknown error');
      return { success: false, error: err instanceof Error ? err.message : 'Error during login process' };
    }
  },

  signup: async ({ request, fetch }): Promise<SuccessResponse<null> | ErrorResponse> => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    try {
      // Sign up user
      const signUpResponse = await authModule.signUp({ email, password }) as SignupResponse;
      console.log('Signup response:', signUpResponse);

      if (!signUpResponse.success) {
        throw new Error(signUpResponse.error || 'Signup failed');
      }

      // Retrieve wallet address
      const addressesResponse = await walletModule.getAddressesByWalletId({});
      console.log('Addresses response:', addressesResponse);

      if (!addressesResponse.data.addresses.length) {
        throw new Error('No addresses found');
      }

      // Insert user data into the database
      const user = await prisma.user.create({
        data: {
          email,
          password, // Ensure this is hashed before saving
          walletAddress: addressesResponse.data.addresses[0]
        }
      });
      console.log('User signup data saved to database:', user);

      return { success: true, data: null };
    } catch (err) {
      console.error('Error during signup process:', err instanceof Error ? err.message : 'Unknown error');
      return { success: false, error: err instanceof Error ? err.message : 'Error during signup process' };
    }
  },
};
