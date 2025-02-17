// /src/api/index.ts

class Api {
  private static instance: Api | null = null;
  private baseUrl: string;
  private instanceId: string;
  private apiKey: string;

  private constructor(baseUrl: string, instanceId: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.instanceId = instanceId;
    this.apiKey = apiKey; // Store the apiKey
  }

  // Method to get the single instance of Api
  public static getInstance(
    baseUrl: string,
    instanceId: string,
    apiKey: string
  ): Api {
    if (!Api.instance) {
      Api.instance = new Api(baseUrl, instanceId, apiKey);
    }
    return Api.instance;
  }

  // Utility function to make API requests
  private async makeApiRequest<T>(
    url: string,
    method: string,
    body?: object
  ): Promise<T> {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}` // API key in the Authorization header
      },
      body: body ? JSON.stringify(body) : undefined
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  // Function to fetch members for a specific instance
  public async getMembers() {
    const url = `${this.baseUrl}/instance/members`;
    return await this.makeApiRequest<any>(url, 'POST', {
      instanceId: this.instanceId
    });
  }

  // Function to fetch mreceivers for a specific instance
  public async getReceivers() {
    const url = `${this.baseUrl}/receiver/get`;
    return await this.makeApiRequest<any>(url, 'POST', {
      instanceId: this.instanceId
    });
  }

  // Function to fetch receivers for a specific instance
  public async getReceiverByEmail(email: string) {
    const url = `${this.baseUrl}/receiver/getByEmail`;
    return await this.makeApiRequest<any>(url, 'POST', {
      instanceId: this.instanceId,
      email
    });
  }

  // Function to create a receiver
  public async createReceiver(receiverData: any) {
    const url = `${this.baseUrl}/receiver/create`; // Example URL
    return await this.makeApiRequest<any>(url, 'POST', {
      instanceId: this.instanceId,
      receiverData
    });
  }

  // Function to fetch members for a specific instance
  public async getBankAccounts(receiverId: string) {
    const url = `${this.baseUrl}/bank-accounts/get`;
    return await this.makeApiRequest<any>(url, 'POST', {
      instanceId: this.instanceId,
      receiverId
    });
  }

  public async createBankAccount(receiverId: string, bankAccountData: any) {
    const url = `${this.baseUrl}/bank-accounts/create`;
    return await this.makeApiRequest<any>(url, 'POST', {
      instanceId: this.instanceId,
      receiverId,
      bankAccountData
    });
  }

  public async deleteBankAccount(receiverId: string, bankAccountId: string) {
    const url = `${this.baseUrl}/bank-accounts/delete`;
    return await this.makeApiRequest<any>(url, 'POST', {
      instanceId: this.instanceId,
      receiverId,
      bankAccountId
    });
  }

  public async getQuote(bankAccountId: string, requestAmount: number) {
    const url = `${this.baseUrl}/quotes/create`;

    const payload = {
      bank_account_id: bankAccountId,
      currency_type: 'sender',
      cover_fees: false,
      request_amount: requestAmount,
      network: 'base_sepolia',
      token: 'USDB'
    };
    console.log('payload: ', payload);

    return await this.makeApiRequest<any>(url, 'POST', {
      instanceId: this.instanceId,
      quoteData: payload
    });
  }
}

export default Api;
