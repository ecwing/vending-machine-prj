import type { Coin, CoinInventory } from '../types/index';

import { coinValues } from '../features/dataTypes';

export interface ChangeResult {
  success: boolean;
  changeCoins: CoinInventory;
  updatedInventory: CoinInventory;
}

export function calculateChange(
  amount: number,
  inventory: CoinInventory
): ChangeResult {
  let remaining = amount;
  const changeCoins: CoinInventory = { nickel: 0, dime: 0, quarter: 0 };
  const newInventory = { ...inventory };

  const coinTypes: Coin[] = ['quarter', 'dime', 'nickel'];

  for (const coin of coinTypes) {
    const coinValue = coinValues[coin];
    while (remaining >= coinValue && newInventory[coin] > 0) {
      remaining -= coinValue;
      newInventory[coin]--;
      changeCoins[coin]++;
    }
  }

  if (remaining === 0) {
    return {
      success: true,
      changeCoins,
      updatedInventory: newInventory,
    };
  }

  // Not enough coins to make change
  return {
    success: false,
    changeCoins: { nickel: 0, dime: 0, quarter: 0 },
    updatedInventory: inventory, // leave unchanged
  };
}
