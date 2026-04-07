import type { Abi } from 'viem';

// ---- Smart Wallet Client ----

export interface TransactionCall {
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
}

export interface TransactionUiOptions {
  title: string;
  description: string;
  buttonText: string;
}

export interface SmartWalletClient {
  sendTransaction(
    params: { calls: TransactionCall[] },
    options?: { uiOptions?: TransactionUiOptions }
  ): Promise<string>;
}

// ---- Receiver ----

export interface Receiver {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  date_of_birth?: string;
  tax_id?: string;
  phone_number?: string;
  address1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  kyc_type?: 'light' | 'standard' | 'enhanced';
  type?: 'individual' | 'business';
}

// ---- Bank Account ----

export interface BlockchainAddresses {
  sepolia: string | null;
  arbitrum_sepolia: string | null;
  base_sepolia: string | null;
  polygon_amoy: string | null;
  base: string | null;
  arbitrum: string | null;
  polygon: string | null;
}

export interface BankAccount {
  id: string;
  type: string;
  name: string;
  pix_key: string | null;
  beneficiary_name: string | null;
  routing_number: string | null;
  account_number: string | null;
  account_type: string | null;
  account_class: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state_province_region: string | null;
  country: string | null;
  postal_code: string | null;
  blockchain_address: BlockchainAddresses;
}

// ---- API Responses ----

export interface ApiError {
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  error: ApiError | null;
}

// ---- Quote ----

export interface QuoteNetwork {
  chainId: number;
  name: string;
}

export interface QuoteContract {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  blindpayContractAddress: `0x${string}`;
  amount: string;
  network: QuoteNetwork;
}

export interface Quote {
  id: string;
  expires_at: number;
  commercial_quotation: number;
  blindpay_quotation: number;
  sender_amount: number;
  partner_fee_amount: number;
  receiver_amount: number;
  flat_fee: number;
  contract: QuoteContract;
}

// ---- Wallet ----

export interface WalletBalanceResponse {
  balance?: string;
  error?: string;
}

// ---- Global State ----

export interface GlobalState {
  receiver: Receiver | null;
  privySmartClient: SmartWalletClient | null;
}
