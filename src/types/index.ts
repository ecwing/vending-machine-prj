export type Coin = 'nickel' | 'dime' | 'quarter';

export type ButtonTypes =
  | 'coin'
  | 'purchase'
  | 'cancel'
  | 'A'
  | 'B'
  | 'C'
  | 'D';

export interface Product {
  name: string;
  price: number;
  stock: number;
}

export interface CoinInventory {
  nickel: number;
  dime: number;
  quarter: number;
}

export interface MachineState {
  balance: number;
  coinInventory: CoinInventory;
  products: Product[];
  currentCoinBalance: CoinInventory;
}
