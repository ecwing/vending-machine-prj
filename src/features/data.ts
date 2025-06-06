import type { Coin, MachineState } from '../types/index';
import type { Product } from '../types/index';

export const products: Product[] = [
  { name: 'Cola', key: 'cola', machineKey: 'A', price: 25, stock: 10 },
  { name: 'Diet Cola', key: 'dietCola', machineKey: 'B', price: 35, stock: 8 },
  { name: 'Lime Soda', key: 'limeSoda', machineKey: 'C', price: 25, stock: 0 },
  { name: 'Water', key: 'water', machineKey: 'D', price: 45, stock: 2 },
];

export const initialMachineState: MachineState = {
  balance: 0,
  remainingBalance: 0,
  selectedProduct: null,
  coinInventory: {
    nickel: 5,
    dime: 5,
    quarter: 5,
  },
  products,
  currentCoinBalance: {
    nickel: 0,
    dime: 0,
    quarter: 0,
  },
  currency: 'USD' as const,
};

export const coinValues: Record<Coin, number> = {
  nickel: 5,
  dime: 10,
  quarter: 25,
};
