import { calculateChange } from '../utils/calculateChange';
import type { CoinInventory } from '../types/index';

import { describe, test, expect } from 'vitest';

describe('calculateChange', () => {
  const initialInventory: CoinInventory = {
    nickel: 5,
    dime: 5,
    quarter: 5,
  };

  test('returns one quarter for 25¢', () => {
    const result = calculateChange(25, initialInventory);
    expect(result.success).toBe(true);
    expect(result.changeCoins).toEqual({ nickel: 0, dime: 0, quarter: 1 });
  });

  test('returns 2 dimes and 1 nickel for 25¢ if no quarters', () => {
    const noQuarterInventory = { ...initialInventory, quarter: 0 };
    const result = calculateChange(25, noQuarterInventory);
    expect(result.success).toBe(true);
    expect(result.changeCoins).toEqual({ nickel: 1, dime: 2, quarter: 0 });
  });

  test('fails if no valid coin combo is available', () => {
    const noCoins = { nickel: 0, dime: 0, quarter: 0 };
    const result = calculateChange(25, noCoins);
    expect(result.success).toBe(false);
  });

  test('returns full amount using only nickels', () => {
    const nickelsOnly = { nickel: 5, dime: 0, quarter: 0 };
    const result = calculateChange(25, nickelsOnly);
    expect(result.success).toBe(true);
    expect(result.changeCoins).toEqual({ nickel: 5, dime: 0, quarter: 0 });
  });

  test('returns smallest number of coins', () => {
    const mixedInventory = { nickel: 100, dime: 100, quarter: 100 };
    const result = calculateChange(40, mixedInventory);
    expect(result.success).toBe(true);
    expect(result.changeCoins).toEqual({ nickel: 1, dime: 1, quarter: 1 }); // 25 + 10 + 5
  });

  test('returns nothing for 0¢', () => {
    const result = calculateChange(0, initialInventory);
    expect(result.success).toBe(true);
    expect(result.changeCoins).toEqual({ nickel: 0, dime: 0, quarter: 0 });
  });
});
