import { DRINK_IMAGES } from '../constants';

export type Coin = 'nickel' | 'dime' | 'quarter';
export type ProductName = 'Cola' | 'Diet Cola' | 'Lime Soda' | 'Water';
type ProductSelectionKeys = 'A' | 'B' | 'C' | 'D';

export type ButtonTypes =
  | 'coin'
  | 'purchase'
  | 'cancel'
  | 'A'
  | 'B'
  | 'C'
  | 'D';

export type currency = 'USD' | 'CAD';
export interface Product {
  name: ProductName;
  key: keyof typeof DRINK_IMAGES;
  machineKey: ProductSelectionKeys;
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
  currency: currency;
}
