import React from 'react';
import CoinButton from '../components/CoinButton';
import ProductSlot from '../components/ProductSlot';
import DisplayScreen from '../components/DisplayScreen';
import ControlPanel from '../components/ControlPanel';
import type { Coin } from '../types/index';

import { useVendingMachine } from '../hooks/useVendingMachine';

const VendingMachine: React.FC = () => {
  const {
    machineState,
    message,
    returnedCoins,
    handleDeposit,
    handleSelectProduct,
    handlePurchase,
    handleCancel,
    resetMachine,
  } = useVendingMachine();

  return (
    <div>
      <div>
        <h3>local balance and vending machine coin balance internal state</h3>
        <p>balance: {machineState.balance}</p>
        <div>Coin Inventory</div>
        <p>Nickels: {machineState.coinInventory.nickel}</p>
        <p>Dimes: {machineState.coinInventory.dime}</p>
        <p>Quarters: {machineState.coinInventory.quarter}</p>
      </div>

      <div>
        <h3>Product Inventory</h3>
        {machineState.products.map(product => (
          <div style={{ display: 'flex' }} key={product.name}>
            <h4 style={{ margin: '5px' }}>name: {product.name}</h4>
            <p style={{ margin: '5px' }}>price: {product.price}</p>
            <p style={{ margin: '5px' }}>stock: {product.stock}</p>
          </div>
        ))}
      </div>

      <DisplayScreen message={message} />

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

      <h2>Select your drink!</h2>
      <div>
        {machineState.products.map(p => (
          <ProductSlot
            key={p.name}
            product={p}
            onClick={() => handleSelectProduct(p)}
          />
        ))}
      </div>
      <ControlPanel onPurchase={handlePurchase} onCancel={handleCancel} />

      {returnedCoins && (
        <div>
          <h4>Coin Return</h4>
          {Object.entries(returnedCoins)
            .filter(([, count]) => count > 0)
            .map(([coin, count]) => (
              <div key={coin}>
                {coin}: {count}
              </div>
            ))}
        </div>
      )}

      <button onClick={resetMachine}>Admin Reset</button>
    </div>
  );
};

export default VendingMachine;
