export type Coin = 'nickel' | 'dime' | 'quarter';
export type ProductName = 'Cola' | 'Diet Cola' | 'Lime Soda' | 'Water';

export type ButtonTypes =
  | 'coin'
  | 'purchase'
  | 'cancel'
  | 'A'
  | 'B'
  | 'C'
  | 'D';

export interface Product {
  name: ProductName;
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
