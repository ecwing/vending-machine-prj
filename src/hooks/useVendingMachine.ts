import { useEffect, useState, useRef, useMemo } from 'react';
import { calculateChange, countTotalCoins } from '../utils/calculateChange';
import { formatAmount } from '../utils/convertToDollarValue';

import {
  saveStateToStorage,
  loadStateFromStorage,
  clearStorage,
} from '../utils/storage';

import type {
  Coin,
  CoinInventory,
  MachineState,
  Product,
  ButtonTypes,
} from '../types/index';
import { coinValues, initialMachineState } from '../features/data';

import { playSound, playRefundSound } from '../utils/soundManager';

import { DEPOSIT_SOUND_DURATION_MS } from '../constants';

import {
  DEFAULT_MESSAGE,
  DEFAULT_ALL_PRODUCTS_SOLD_OUT,
  DISPLAY_BALANCE,
  SELECTED_PRODUCT,
  ADMIN_RESET_MESSAGE,
  ADMIN_ZERO_MESSAGE,
  ADMIN_SWAP_CURRENCY_MESSAGE,
  ADMIN_TOGGLE_DISPLAY_MESSAGE,
  SOLD_OUT_MESSAGE,
  SELECT_FIRST_MESSAGE,
  SOLD_OUT_ITEM_MESSAGE,
  BALANCE_REMAINING_FOR_PURCHASE,
  INSUFFICIENT_FUNDS_MESSAGE,
  THANK_YOU_MESSAGE,
  UNABLE_TO_MAKE_CHANGE_MESSAGE,
  REFUND_AMOUNT_MESSAGE,
  REFUND_OVERPAYMENT,
} from '../utils/machineMessages';

import {
  ADMIN_SEQUENCE_RESET,
  ADMIN_SEQUENCE_ZERO,
  ADMIN_SEQUENCE_SWAP_CURRENCY,
  ADMIN_SEQUENCE_TOGGLE_DISPLAY,
} from '../utils/adminSequences';

export function useVendingMachine() {
  const [machineState, setMachineState] = useState(() => {
    return loadStateFromStorage<MachineState>() || initialMachineState;
  });

  const selectedProduct = machineState.selectedProduct;
  const setSelectedProduct = (product: Product | null) =>
    setMachineState(prev => ({
      ...prev,
      selectedProduct: product,
      remainingBalance: product ? Math.max(0, product.price - prev.balance) : 0,
    }));

  const initialSelectedProduct = machineState.selectedProduct;

  const [message, setMessage] = useState<string>(() => {
    if (initialSelectedProduct?.name) {
      return `Selected: ${initialSelectedProduct.name}`;
    }
    return DEFAULT_MESSAGE;
  });

  const [returnedCoins, setReturnedCoins] = useState<CoinInventory | null>(
    null
  );

  const [showAdminDisplay, setShowAdminDisplay] = useState(false);

  const [droppedProduct, setDroppedProduct] = useState<Product | null>(null);

  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputSequenceRef = useRef<string[]>([]);

  const { balance, currency, remainingBalance } = machineState;

  const allProductsSoldOut = useMemo(
    () => machineState.products.every(p => p.stock === 0),
    [machineState.products]
  );

  const getDefaultMessage = () => {
    return allProductsSoldOut ? DEFAULT_ALL_PRODUCTS_SOLD_OUT : DEFAULT_MESSAGE;
  };

  const trackedState = useMemo(
    () => ({
      balance: machineState.balance,
      remainingBalance: machineState.remainingBalance,
      selectedProduct: machineState.selectedProduct,
      coinInventory: machineState.coinInventory,
      products: machineState.products,
      currentCoinBalance: machineState.currentCoinBalance,
      currency: machineState.currency,
    }),
    [
      machineState.balance,
      machineState.remainingBalance,
      machineState.selectedProduct,
      machineState.coinInventory,
      machineState.products,
      machineState.currentCoinBalance,
      machineState.currency,
    ]
  );

  const setMessageWithTimeout = (msg: string, duration = 7000) => {
    setMessage(msg);

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = setTimeout(() => {
      setMessage(getDefaultMessage());
      messageTimeoutRef.current = null;
    }, duration);
  };

  const handleInput = (input: ButtonTypes): boolean => {
    inputSequenceRef.current = [...inputSequenceRef.current, input].slice(
      -ADMIN_SEQUENCE_RESET.length
    );

    const isAdminSequenceReset =
      inputSequenceRef.current.join(',') === ADMIN_SEQUENCE_RESET.join(',');

    const isAdminSequenceZero =
      inputSequenceRef.current.join(',') === ADMIN_SEQUENCE_ZERO.join(',');

    const isAdminSequenceSwapCurrency =
      inputSequenceRef.current.join(',') ===
      ADMIN_SEQUENCE_SWAP_CURRENCY.join(',');

    const isAdminSequenceToggleDisplay =
      inputSequenceRef.current.join(',') ===
      ADMIN_SEQUENCE_TOGGLE_DISPLAY.join(',');

    if (isAdminSequenceSwapCurrency) {
      const newCurrency = currency === 'USD' ? 'CAD' : 'USD';
      setMachineState(prev => ({ ...prev, currency: newCurrency }));
      setMessageWithTimeout(ADMIN_SWAP_CURRENCY_MESSAGE);
      playSound('adminReset');
      return true;
    }

    if (isAdminSequenceToggleDisplay) {
      if (!showAdminDisplay)
        setMessageWithTimeout(ADMIN_TOGGLE_DISPLAY_MESSAGE);
      setShowAdminDisplay(prev => !prev);
      playSound('adminReset');
      return true;
    }

    if (isAdminSequenceReset) {
      resetMachine();
      playSound('adminReset');
      return true;
    }
    if (isAdminSequenceZero) {
      zeroOutMachine();
      playSound('adminReset');
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log('BP EW *** useEffect: ', machineState);
    saveStateToStorage({ ...machineState });
  }, [trackedState]); // eslint-disable-line react-hooks/exhaustive-deps

  // bonus admin level functionality to reset machine to initial state
  const resetMachine = () => {
    clearStorage();
    setMachineState(initialMachineState);

    setMessageWithTimeout(ADMIN_RESET_MESSAGE);
  };

  // bonus admin level functionality to zero machine coin inventory and product stock
  const zeroOutMachine = () => {
    clearStorage();
    setMachineState({
      balance: 0,
      remainingBalance: 0,
      selectedProduct: null,
      coinInventory: {
        nickel: 0,
        dime: 0,
        quarter: 0,
      },
      currentCoinBalance: {
        nickel: 0,
        dime: 0,
        quarter: 0,
      },
      products: machineState.products.map(p => ({
        ...p,
        stock: 0,
      })),
      currency: 'USD',
    });
    setMessageWithTimeout(ADMIN_ZERO_MESSAGE);
  };

  const handleDeposit = (coin: Coin) => {
    handleInput('coin');
    playSound('deposit');

    if (allProductsSoldOut) {
      setMessageWithTimeout(SOLD_OUT_MESSAGE);
      const coinValue = coinValues[coin];

      const tempInventory = {
        ...machineState.coinInventory,
        [coin]: machineState.coinInventory[coin] + 1,
      };

      const updatedDeposited = {
        ...machineState.currentCoinBalance,
        [coin]: machineState.currentCoinBalance[coin] + 1,
      };

      const tempBalance = machineState.balance + coinValue;

      setMachineState(prev => ({
        ...prev,
        balance: tempBalance,
        coinInventory: tempInventory,
        currentCoinBalance: { ...updatedDeposited },
      }));

      setTimeout(() => {
        processRefund({
          balance: tempBalance,
          coinInventory: tempInventory,
          currentCoinBalance: updatedDeposited,
        });
      }, DEPOSIT_SOUND_DURATION_MS);
      return;
    }

    const value = coinValues[coin];

    const updatedInventory = {
      ...machineState.coinInventory,
      [coin]: machineState.coinInventory[coin] + 1,
    };

    const updatedDeposited = {
      ...machineState.currentCoinBalance,
      [coin]: machineState.currentCoinBalance[coin] + 1,
    };

    const newBalance = machineState.balance + value;
    const newRemaining = selectedProduct
      ? Math.max(0, selectedProduct.price - newBalance)
      : 0;

    // Attempt to refund overpayment if a product is selected
    const refunded = handleOverpaymentRefund(value, updatedInventory);

    if (!refunded) {
      setMachineState(prev => ({
        ...prev,
        balance: prev.balance + value,
        coinInventory: updatedInventory,
        currentCoinBalance: updatedDeposited,
        remainingBalance: newRemaining,
      }));
      setMessage(DISPLAY_BALANCE(value));
    }
  };

  const handleSelectProduct = (product: Product) => {
    playSound('select');
    setSelectedProduct(product);
    setMessage(SELECTED_PRODUCT(product.name));

    if (product.stock === 0) {
      setMessage(SOLD_OUT_ITEM_MESSAGE);
    }

    if (product.name === 'Cola') handleInput('A');
    if (product.name === 'Diet Cola') handleInput('B');
    if (product.name === 'Lime Soda') handleInput('C');
    if (product.name === 'Water') handleInput('D');
  };

  const handlePurchase = () => {
    playSound('select');
    const isAdminSequenceHit = handleInput('purchase');
    if (isAdminSequenceHit) return;

    if (!selectedProduct) {
      setMessage(SELECT_FIRST_MESSAGE);
      return;
    }

    if (selectedProduct.stock === 0) {
      setMessageWithTimeout(SOLD_OUT_ITEM_MESSAGE);
      return;
    }

    if (balance < selectedProduct.price) {
      // If balance is zero - the user has not yet deposited any coins
      if (balance === 0) {
        setMessage(
          BALANCE_REMAINING_FOR_PURCHASE(selectedProduct.price - balance)
        );
        return;
      }
      // If the balance is a non-zero amount but less than the product price
      setMessage(INSUFFICIENT_FUNDS_MESSAGE(selectedProduct.price - balance));
      return;
    }

    const changeAmount = balance - selectedProduct.price;
    const { success, changeCoins, updatedInventory } = calculateChange(
      changeAmount,
      machineState.coinInventory
    );

    if (!success) {
      handleCancel();
      return;
    }

    const updatedProducts = machineState.products.map(p =>
      p.name === selectedProduct.name ? { ...p, stock: p.stock - 1 } : p
    );

    setMachineState({
      ...machineState,
      balance: 0,
      coinInventory: updatedInventory,
      products: updatedProducts,
    });

    setReturnedCoins(changeCoins);

    setDroppedProduct(selectedProduct);

    setTimeout(() => {
      setDroppedProduct(null);
    }, 3500); // matches the animation duration

    const changeMesssage =
      changeAmount > 0 ? `Change: ${formatAmount(changeAmount)}` : 'No Change';

    if (changeAmount === 0) {
      playSound('dispense');
    } else {
      // make it play according to number of coins dispensed
      playSound('dispense');
      const total = countTotalCoins(changeCoins);
      playRefundSound(total);
    }
    setMessageWithTimeout(THANK_YOU_MESSAGE(changeMesssage));
    setSelectedProduct(null);
  };

  const processRefund = (
    overrides?: Partial<
      Pick<MachineState, 'balance' | 'coinInventory' | 'currentCoinBalance'>
    >
  ) => {
    const refundAmount = overrides?.balance ?? balance;
    const coinInventory =
      overrides?.coinInventory ?? machineState.coinInventory;
    const currentCoinBalance =
      overrides?.currentCoinBalance ?? machineState.currentCoinBalance;

    const { nickel, dime, quarter } = currentCoinBalance;
    const refundCoins = { nickel, dime, quarter };

    const { success, changeCoins, updatedInventory } = calculateChange(
      refundAmount,
      coinInventory
    );

    let coinsToReturn = changeCoins;
    let inventoryToUpdate = updatedInventory;

    if (!success) {
      coinsToReturn = refundCoins;
      inventoryToUpdate = {
        ...coinInventory,
        nickel: coinInventory.nickel - nickel,
        dime: coinInventory.dime - dime,
        quarter: coinInventory.quarter - quarter,
      };
    }

    const total = countTotalCoins(coinsToReturn);

    if (refundAmount) {
      playSound('select');
      playRefundSound(total);
    } else {
      playSound('select');
    }

    setMachineState({
      ...machineState,
      balance: 0,
      coinInventory: inventoryToUpdate,
      currentCoinBalance: { nickel: 0, dime: 0, quarter: 0 },
    });

    setReturnedCoins(coinsToReturn);

    return { refundAmount, success };
  };

  const handleCancel = () => {
    const isAdminSequenceHit = handleInput('cancel');
    if (isAdminSequenceHit) return;

    setSelectedProduct(null);

    const { refundAmount, success } = processRefund();

    if (!success) {
      setMessageWithTimeout(UNABLE_TO_MAKE_CHANGE_MESSAGE);
      return;
    }

    setMessageWithTimeout(REFUND_AMOUNT_MESSAGE(refundAmount));
  };

  const handleOverpaymentRefund = (
    value: number,
    updatedCoinInventory: CoinInventory
  ): boolean => {
    if (!selectedProduct) return false;

    const price = selectedProduct.price;

    const wasAlreadySufficient = balance >= price;
    const causesOverpayment = balance + value > price;

    if (wasAlreadySufficient && causesOverpayment) {
      const overpaid = value;

      const { success, changeCoins, updatedInventory } = calculateChange(
        overpaid,
        updatedCoinInventory
      );

      if (success) {
        const updateMachine = () => {
          setReturnedCoins(changeCoins);
          playRefundSound(countTotalCoins(changeCoins));
          setMachineState(prev => ({
            ...prev,
            balance: balance,
            coinInventory: updatedInventory,
          }));
          setMessage(REFUND_OVERPAYMENT(overpaid));
        };
        setTimeout(updateMachine, DEPOSIT_SOUND_DURATION_MS);
        return true;
      }
    }

    return false;
  };

  return {
    showAdminDisplay,
    handleCancel,
    handleDeposit,
    handlePurchase,
    handleSelectProduct,
    machineState,
    message,
    balance,
    remainingBalance,
    selectedProduct,
    currency,
    returnedCoins,
    droppedProduct,
  };
}
