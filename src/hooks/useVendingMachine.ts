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

import {
  ADMIN_SEQUENCE_RESET,
  ADMIN_SEQUENCE_ZERO,
  DEFAULT_MESSAGE,
  DISPLAY_BALANCE,
  SELECTED_PRODUCT,
  ADMIN_RESET_MESSAGE,
  ADMIN_ZERO_MESSAGE,
  SOLD_OUT_MESSAGE,
  SELECT_FIRST_MESSAGE,
  SOLD_OUT_ITEM_MESSAGE,
  BALANCE_REMAINING_FOR_PURCHASE,
  // NO_BALANCE_MESSAGE,
  INSUFFICIENT_FUNDS_MESSAGE,
  THANK_YOU_MESSAGE,
  UNABLE_TO_MAKE_CHANGE_MESSAGE,
  REFUND_AMOUNT_MESSAGE,
} from '../constants';

export function useVendingMachine() {
  const [machineState, setMachineState] = useState(() => {
    return loadStateFromStorage<MachineState>() || initialMachineState;
  });

  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [returnedCoins, setReturnedCoins] = useState<CoinInventory | null>(
    null
  );

  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputSequenceRef = useRef<string[]>([]);

  const allProductsSoldOut = useMemo(
    () => machineState.products.every(p => p.stock === 0),
    [machineState.products]
  );

  const setMessageWithTimeout = (msg: string, duration = 5000) => {
    setMessage(msg);

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = setTimeout(() => {
      setMessage(DEFAULT_MESSAGE);
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

  // Save to localStorage anytime state changes
  // !TO DO USEEFFCT HAS TOO MANY STATE UPDATES CAUSING RE-RENDERS
  useEffect(() => {
    saveStateToStorage(machineState);
    //   console.log('machineState.balance: ', machineState.balance);
    //   console.log('machineState.coinInventory: ', machineState.coinInventory);
    //   console.log('machineState.products: ', machineState.products);

    // if (machineState.products.every(p => p.stock === 0)) {
    //   setMessage('All products have been sold out. Come back again!');
    // }
  }, [machineState]);

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
      }, 1500); // timeout to consider length of deposit sound to refund sound
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

    setMachineState(prev => ({
      ...prev,
      balance: prev.balance + value,
      coinInventory: updatedInventory,
      currentCoinBalance: updatedDeposited,
    }));
    setMessage(DISPLAY_BALANCE(machineState.balance + value));
  };

  const handleSelectProduct = (product: Product) => {
    playSound('select');
    setSelectedProduct(product);
    setMessage(SELECTED_PRODUCT(product.name));

    if (product.stock === 0) {
      setMessageWithTimeout(SOLD_OUT_ITEM_MESSAGE);
    }

    if (product.name === 'Cola') handleInput('A');
    if (product.name === 'Diet Cola') handleInput('B');
    if (product.name === 'Lime Soda') handleInput('C');
    if (product.name === 'Water') handleInput('D');
  };

  const handlePurchase = () => {
    const isAdminSequenceHit = handleInput('purchase');
    if (isAdminSequenceHit) return;

    if (!selectedProduct) {
      setMessageWithTimeout(SELECT_FIRST_MESSAGE);
      return;
    }

    if (selectedProduct.stock === 0) {
      setMessageWithTimeout(SOLD_OUT_ITEM_MESSAGE);
      return;
    }

    if (machineState.balance < selectedProduct.price) {
      // If balance is zero - the user has not yet deposited any coins
      if (machineState.balance === 0) {
        setMessage(
          BALANCE_REMAINING_FOR_PURCHASE(
            selectedProduct.price - machineState.balance
          )
        );
        return;
      }
      // If the balance is a non-zero amount but less than the product price
      setMessage(
        INSUFFICIENT_FUNDS_MESSAGE(selectedProduct.price - machineState.balance)
      );
      return;
    }

    const changeAmount = machineState.balance - selectedProduct.price;
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
    const refundAmount = overrides?.balance ?? machineState.balance;
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

  return {
    handleCancel,
    handleDeposit,
    handlePurchase,
    handleSelectProduct,
    machineState,
    message,
    returnedCoins,
  };
}
