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

  // Handles product selection
  const handleSelectProduct = (product: Product) => {
    if (product.stock === 0) {
      setMessage('SOLD OUT');
      return;
    }

    if (machineState.balance < product.price) {
      setMessage(`PRICE: ${product.price}¢`);
      return;
    }

    const changeAmount = machineState.balance - product.price;

    const {
      success,
      /* changeCoins, */
      updatedInventory,
    } = calculateChange(changeAmount, machineState.coinInventory);

    if (!success) {
      setMessage('EXACT CHANGE ONLY');
      return;
    }

    // Enough balance and in stock
    // const change = machineState.balance - product.price;
    const updatedProducts = machineState.products.map(p =>
      p.name === product.name ? { ...p, stock: p.stock - 1 } : p
    );

    setMachineState({
      ...machineState,
      balance: 0,
      coinInventory: updatedInventory,
      products: updatedProducts,
    });

    const changeMsg =
      changeAmount > 0 ? `Change: ${changeAmount}¢` : 'No Change';
    setMessage(`Thank you. ${changeMsg}`);
  };

  // Handles cancel
  const handleCancel = () => {
    const refund = machineState.balance;
    setMachineState({
      ...machineState,
      balance: 0,
    });
    setMessage(`Refund: ${refund}¢`);
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
            onClick={() => handleSelectProduct(product)}
          />
        ))}
      </div>
      <ControlPanel
        onCancel={handleCancel}
        onPurchase={() => setMessage('Select a product first')}
      />
    </div>
  );
};

export default VendingMachine;
