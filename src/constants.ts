import { formatAmount } from './utils/convertToDollarValue';
import type { Coin, ProductName } from './types/index';

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

export const COINS: Coin[] = ['nickel', 'dime', 'quarter'];
export const COINS_SORTED_DESCENDING: Coin[] = ['quarter', 'dime', 'nickel'];

export const DEFAULT_MESSAGE = 'Welcome! Please make a selection.';

export const DISPLAY_BALANCE = (amount: number) =>
  `Balance: ${formatAmount(amount)}`;

export const SELECTED_PRODUCT = (productName: ProductName) =>
  `Selected: ${productName}`;

export const ADMIN_RESET_MESSAGE = `Welcome admin! Coins & drink stocks reset to initial values.`;
export const ADMIN_ZERO_MESSAGE =
  'Welcome admin! Coins & drink stocks removed.';
export const SOLD_OUT_MESSAGE =
  'Sorry all products sold out. Refunding your coin(s).';

export const SELECT_FIRST_MESSAGE = 'Select a product first';
export const SOLD_OUT_ITEM_MESSAGE =
  'Sorry we&apos;re sold out of this item. Please make another selection.';

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
