import { formatAmount } from './utils/convertToDollarValue';
import type { Coin, ProductName } from './types/index';

import usNickel from './assets/us-nickel.webp';
import usDime from './assets/us-dime.webp';
import usQuarter from './assets/us-quarter.webp';

import canNickel from './assets/can-nickel.webp';
import canDime from './assets/can-dime.webp';
import canQuarter from './assets/can-quarter.webp';

import crispCola from './assets/crisp-cola.webp';
import crispDietCola from './assets/crisp-diet-cola.webp';
import crispLimeSoda from './assets/crisp-lime-soda.webp';
import crispWater from './assets/crisp-water.webp';

export const COIN_IMAGES = {
  USD: {
    nickel: usNickel,
    dime: usDime,
    quarter: usQuarter,
  },
  CAD: {
    nickel: canNickel,
    dime: canDime,
    quarter: canQuarter,
  },
} as const;

export const DRINK_IMAGES = {
  cola: crispCola,
  dietCola: crispDietCola,
  limeSoda: crispLimeSoda,
  water: crispWater,
} as const;

export const ADMIN_SEQUENCE_RESET = [
  'A',
  'D',
  'A',
  'D',
  'B',
  'C',
  'B',
  'C',
  'purchase',
];
export const ADMIN_SEQUENCE_ZERO = [
  'A',
  'D',
  'A',
  'D',
  'B',
  'C',
  'B',
  'C',
  'cancel',
];

export const ADMIN_SEQUENCE_SWAP_CURRENCY = [
  'A',
  'C',
  'A',
  'C',
  'B',
  'D',
  'B',
  'D',
  'purchase',
];

export const COINS: Coin[] = ['nickel', 'dime', 'quarter'];
export const COINS_SORTED_DESCENDING: Coin[] = ['quarter', 'dime', 'nickel'];

export const DEFAULT_MESSAGE = 'Welcome! Please make a selection.';

export const DISPLAY_BALANCE = (amount: number) =>
  `Inserted: ${formatAmount(amount)}`;

export const SELECTED_PRODUCT = (product: ProductName) =>
  `Selected: ${product}`;

export const ADMIN_RESET_MESSAGE = `Welcome admin! Coins & drink stocks reset to initial values.`;
export const ADMIN_ZERO_MESSAGE =
  'Welcome admin! Coins & drink stocks removed.';
export const SOLD_OUT_MESSAGE =
  'Sorry all products sold out. Refunding your coin(s).';

export const SELECT_FIRST_MESSAGE = 'Select a product first.';
export const SOLD_OUT_ITEM_MESSAGE = `Sorry we're sold out of this item. Please make another selection.`;

export const BALANCE_REMAINING_FOR_PURCHASE = (
  selectedProductBalance: number
) => `Please insert coins: ${formatAmount(selectedProductBalance)}`;

export const INSUFFICIENT_FUNDS_MESSAGE = (amount: number) =>
  `Insufficient funds, remaining balance required: ${formatAmount(amount)}`;

export const THANK_YOU_MESSAGE = (changeMesssage: string) =>
  `Thank you! ${changeMesssage}`;
export const UNABLE_TO_MAKE_CHANGE_MESSAGE =
  'Unable to make change, purchase cancelled and coins refunded';
export const REFUND_AMOUNT_MESSAGE = (refundAmount: number) =>
  `Refund amount: ${formatAmount(refundAmount)}`;
