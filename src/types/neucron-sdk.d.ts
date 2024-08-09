declare module 'neucron-sdk' {
    class NeucronSDK {
        transactionModule: any;
      transaction: any;
        publishArticle(arg0: { title: string; content: string; category: string; image: string | undefined; userWallet: string; articleId: number; }) {
          throw new Error("Method not implemented.");
        }
        authentication: {
            getWalletIdFromToken(access_token: string): unknown;
            login(arg0: { email: any; password: any; }): unknown;
            Login(credentials: { email: string; password: string }): Promise<{ success: boolean }>;
            signUp(credentials: { email: string; password: string }): Promise<{ success: boolean }>;
        };
        wallet: {
            sendTransaction(arg0: { walletAddress: any; amount: number; description: string; }): unknown;
            getWalletBalance(params: any): Promise<{ data: { balance: { summary: string } } }>;
            getAddressesByWalletId(params: any): Promise<{ data: { addresses: string[] } }>;
        };
    }

    export = NeucronSDK;
}