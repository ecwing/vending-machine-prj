import { useState } from 'react';
import { calculateChange } from '../utils/calculateChange';
import type {
  Coin,
  CoinInventory,
  MachineState,
  Product,
} from '../types/index';
import { coinValues, initialMachineState } from '../features/dataTypes';

export function useVendingMachine() {
  const [machineState, setMachineState] =
    useState<MachineState>(initialMachineState);
  const [message, setMessage] = useState<string>('INSERT COIN');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [returnedCoins, setReturnedCoins] = useState<CoinInventory | null>(
    null
  );

  const handleDeposit = (coin: Coin) => {
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
    setMessage(`Balance: ${machineState.balance + value}¢`);
  };

  const handleSelectProduct = (product: Product) => {
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
      setMessage(`Price: ${selectedProduct.price}¢`);
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
      changeAmount > 0 ? `Change: ${changeAmount}¢` : 'No Change';

    setMessage(`Thank you! ${changeMesssage}`);
    setSelectedProduct(null);
  };

  const handleCancel = () => {
    const refundAmount = machineState.balance;

    const { success, changeCoins, updatedInventory } = calculateChange(
      refundAmount,
      machineState.coinInventory
    );

    if (!success) {
      setMessage('Unable to make change – contact support');
      return;
    }

    setMachineState({
      ...machineState,
      balance: 0,
      coinInventory: updatedInventory,
    });

    setReturnedCoins(changeCoins);
    setMessage(`REFUND: ${refundAmount}¢`);
  };

  return {
    machineState,
    message,
    returnedCoins,
    handleDeposit,
    handleSelectProduct,
    handlePurchase,
    handleCancel,
  };
}
