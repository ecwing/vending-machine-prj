import { useEffect, useState } from 'react';
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
} from '../types/index';
import { coinValues, initialMachineState } from '../features/dataTypes';

import { playSound, playRefundSound } from '../utils/soundManager';

export function useVendingMachine() {
  const [machineState, setMachineState] = useState(() => {
    return loadStateFromStorage<MachineState>() || initialMachineState;
  });
  const [message, setMessage] = useState<string>('Insert coins');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [returnedCoins, setReturnedCoins] = useState<CoinInventory | null>(
    null
  );

  // Save to localStorage anytime state changes
  useEffect(() => {
    saveStateToStorage(machineState);
  }, [machineState]);

  // bonus admin level functionality to reset machine to initial state
  const resetMachine = () => {
    clearStorage();
    setMachineState(initialMachineState);

    setMessage(
      `Welcome admin, the machine has been reset. All coin quantities and drink stocks are back to their initial quanitity values.`
    );
  };

  const handleDeposit = (coin: Coin) => {
    playSound('deposit');
    const value = coinValues[coin];
    const updatedInventory = {
      ...machineState.coinInventory,
      [coin]: machineState.coinInventory[coin] + 1,
    };

    setMachineState({
      ...machineState,
      balance: machineState.balance + value,
      coinInventory: updatedInventory,
    });
    setMessage(`Balance: ${formatAmount(machineState.balance + value)}`);
  };

  const handleSelectProduct = (product: Product) => {
    playSound('select');
    setSelectedProduct(product);
    setMessage(`Selected: ${product.name}`);
  };

  const handlePurchase = () => {
    if (!selectedProduct) {
      setMessage('Select a product first');
      return;
    }

    if (selectedProduct.stock === 0) {
      setMessage('Sold out');
      return;
    }

    if (machineState.balance < selectedProduct.price) {
      // If balance is zero - the user has not yet deposited any coins
      if (machineState.balance === 0) {
        setMessage(
          `Please insert coins: ${formatAmount(selectedProduct.price - machineState.balance)}`
        );
        return;
      }
      // If the balance is a non-zero amount but less than the product price
      setMessage(
        `Insufficient funds, remaining balance required: ${formatAmount(selectedProduct.price - machineState.balance)}`
      );
      return;
    }

    const changeAmount = machineState.balance - selectedProduct.price;
    const { success, changeCoins, updatedInventory } = calculateChange(
      changeAmount,
      machineState.coinInventory
    );

    if (!success) {
      setMessage('Exact change only');
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
    setMessage(`Thank you! ${changeMesssage}`);
    setSelectedProduct(null);
  };

  const handleCancel = () => {
    const refundAmount = machineState.balance;

    const { success, changeCoins, updatedInventory } = calculateChange(
      refundAmount,
      machineState.coinInventory
    );

    const total = countTotalCoins(changeCoins);

    if (refundAmount) {
      playSound('select');
      // make it play according to number of coins dispensed
      playRefundSound(total);
    } else {
      playSound('select');
    }

    if (!success) {
      setMessage(
        'Sorry we are unable to make change. Your purchase has been cancelled and your money has been refunded'
      );
      return;
    }

    setMachineState({
      ...machineState,
      balance: 0,
      coinInventory: updatedInventory,
    });

    setReturnedCoins(changeCoins);
    setMessage(`Refund amount: ${formatAmount(refundAmount)}`);
  };

  return {
    handleCancel,
    handleDeposit,
    handlePurchase,
    handleSelectProduct,
    machineState,
    message,
    resetMachine,
    returnedCoins,
  };
}
