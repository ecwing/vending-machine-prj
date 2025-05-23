import type { ProductName } from '../types/index';
import { formatAmount } from './convertToDollarValue';

export const DEFAULT_MESSAGE =
  'Welcome! Please deposit coins and make a selection.';

export const DEFAULT_ALL_PRODUCTS_SOLD_OUT =
  'All products have been sold out. Please come back later.';

export const DISPLAY_BALANCE = (amount: number) =>
  `Inserted: ${formatAmount(amount)}`;

export const SELECTED_PRODUCT = (product: ProductName) =>
  `Selected: ${product}`;

export const ADMIN_RESET_MESSAGE = `Welcome admin! Coins & drink stocks reset to initial values.`;
export const ADMIN_ZERO_MESSAGE =
  'Welcome admin! Coins & drink stocks removed.';
export const ADMIN_SWAP_CURRENCY_MESSAGE =
  'Welcome admin! Currency has been changed';

export const ADMIN_TOGGLE_DISPLAY_MESSAGE = `Welcome admin! Coin inventory and product stock now visible`;

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

export const REFUND_OVERPAYMENT = (refundAmount: number) =>
  `Refunding overpayment: ${formatAmount(refundAmount)}`;
