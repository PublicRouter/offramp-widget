import type {
  Receiver,
  BankAccount,
  ApiResponse,
  Quote,
  WalletBalanceResponse,
} from '../types';

class Api {
  private baseUrl: string;
  private instanceId: string;
  private apiKey: string;

  constructor(baseUrl: string, instanceId: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.instanceId = instanceId;
    this.apiKey = apiKey;
  }

  private async request<T>(
    url: string,
    method: string,
    body?: object
  ): Promise<T> {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  }

  public async getMembers(): Promise<ApiResponse<unknown>> {
    const url = `${this.baseUrl}/instance/members`;
    return this.request(url, 'POST', { instanceId: this.instanceId });
  }

  public async getReceivers(): Promise<ApiResponse<Receiver[]>> {
    const url = `${this.baseUrl}/receiver/get`;
    return this.request(url, 'POST', { instanceId: this.instanceId });
  }

  public async getReceiverByEmail(email: string): Promise<Receiver> {
    const url = `${this.baseUrl}/receiver/getByEmail`;
    return this.request(url, 'POST', { instanceId: this.instanceId, email });
  }

  public async createReceiver(
    receiverData: Record<string, unknown>
  ): Promise<ApiResponse<Receiver>> {
    const url = `${this.baseUrl}/receiver/create`;
    const payload = {
      ...receiverData,
      type: 'individual',
      kyc_type: receiverData.country === 'US' ? 'standard' : 'light',
    };
    return this.request(url, 'POST', {
      instanceId: this.instanceId,
      receiverData: payload,
    });
  }

  public async getBankAccounts(
    receiverId: string
  ): Promise<ApiResponse<BankAccount[]>> {
    const url = `${this.baseUrl}/bank-accounts/get`;
    return this.request(url, 'POST', {
      instanceId: this.instanceId,
      receiverId,
    });
  }

  public async createBankAccount(
    receiverId: string,
    bankAccountData: Record<string, string>
  ): Promise<ApiResponse<BankAccount>> {
    const url = `${this.baseUrl}/bank-accounts/create`;
    return this.request(url, 'POST', {
      instanceId: this.instanceId,
      receiverId,
      bankAccountData,
    });
  }

  public async deleteBankAccount(
    receiverId: string,
    bankAccountId: string
  ): Promise<ApiResponse<null>> {
    const url = `${this.baseUrl}/bank-accounts/delete`;
    return this.request(url, 'POST', {
      instanceId: this.instanceId,
      receiverId,
      bankAccountId,
    });
  }

  public async getQuote(
    bankAccountId: string,
    requestAmount: number
  ): Promise<ApiResponse<Quote>> {
    const url = `${this.baseUrl}/quotes/create`;
    return this.request(url, 'POST', {
      instanceId: this.instanceId,
      quoteData: {
        bank_account_id: bankAccountId,
        currency_type: 'sender',
        cover_fees: false,
        request_amount: requestAmount,
        network: 'base_sepolia',
        token: 'USDB',
      },
    });
  }

  public async getWalletBalance(
    walletAddress: string
  ): Promise<WalletBalanceResponse> {
    const url = `${this.baseUrl}/wallet/balance`;
    return this.request(url, 'POST', { walletAddress });
  }
}

export default Api;
