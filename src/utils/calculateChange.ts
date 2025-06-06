import type { Coin, CoinInventory } from '../types/index';

import { coinValues } from '../features/data';

import { COINS_SORTED_DESCENDING } from '../constants';

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

  const coinTypes: Coin[] = COINS_SORTED_DESCENDING;

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

export function countTotalCoins(coins: CoinInventory): number {
  return Object.values(coins).reduce((sum, count) => sum + count, 0);
}
