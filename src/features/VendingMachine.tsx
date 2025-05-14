import React, { useState } from 'react';
import CoinButton from '../components/CoinButton';
import ProductSlot from '../components/ProductSlot';
import DisplayScreen from '../components/DisplayScreen';
import ControlPanel from '../components/ControlPanel';
import { coinValues, initialMachineState, products } from './dataTypes';
import type {
  Coin,
  CoinInventory,
  MachineState,
  Product,
} from '../types/index';

import { calculateChange } from '../utils/calculateChange';

const VendingMachine: React.FC = () => {
  const [machineState, setMachineState] =
    useState<MachineState>(initialMachineState);
  const [message, setMessage] = useState<string>('INSERT COINS');
  const [returnedCoins, setReturnedCoins] = useState<CoinInventory | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Handle coin deposit
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

  const handlePurchaseSelectedProduct = () => {
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

  // Handles cancel
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
    setMessage(`Refund: ${refundAmount}¢`);
  };

  return (
    <div>
      <DisplayScreen message={message} />
      {returnedCoins && (
        <div>
          <h4>Coin Return</h4>
          {Object.entries(returnedCoins)
            .filter(([_, count]) => count > 0)
            .map(([coin, count]) => (
              <div key={coin}>
                {coin}: {count}
              </div>
            ))}
        </div>
      )}
      <div>
        <h2>Deposit Coins</h2>
        {(['nickel', 'dime', 'quarter'] as Coin[]).map(coin => (
          <CoinButton
            key={coin}
            type={coin}
            onClick={() => handleDeposit(coin)}
          />
        ))}
      </div>
      <div>
        <h2>Select your drink!</h2>
        {products.map(product => (
          <ProductSlot
            key={product.name}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>
      <ControlPanel
        onCancel={handleCancel}
        onPurchase={handlePurchaseSelectedProduct}
      />
    </div>
  );
};

export default VendingMachine;
