
export interface Transaction {
  id: string;
  amount: number;
  type: 'gain' | 'expense';
  description: string;
  timestamp: number;
}

export interface Coin {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

export interface VaultTheme {
  primary: string;
  secondary: string;
  accent: string;
  bgClass: string;
  coinPalette: string[];
  bannerIcon: string;
}

export interface Vault {
  id: string;
  name: string;
  subtitle: string;
  balance: number;
  transactions: Transaction[];
  theme: VaultTheme;
}
