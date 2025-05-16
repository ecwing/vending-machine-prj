import React from 'react';
import CoinButton from '../components/CoinButton';
import ProductSlot from '../components/ProductSlot';
import DisplayScreen from '../components/DisplayScreen';
import ControlPanel from '../components/ControlPanel';
import type { Coin } from '../types/index';

import { formatAmount } from '../utils/convertToDollarValue';

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
      <div style={{ display: 'flex' }}>
        <div style={{ margin: '5px' }}>
          <h3>User/coin balance state</h3>
          <p>balance: {formatAmount(machineState.balance)}</p>
          <p>Nickels: {machineState.coinInventory.nickel} coins</p>
          <p>Dimes: {machineState.coinInventory.dime} coins</p>
          <p>Quarters: {machineState.coinInventory.quarter} coins</p>
        </div>

        <div style={{ margin: '5px' }}>
          <h3>Product Inventory</h3>
          {machineState.products.map(product => (
            <div style={{ display: 'flex' }} key={product.name}>
              <h4 style={{ margin: '5px' }}>{product.name} - </h4>
              <p style={{ margin: '5px' }}>stock: {product.stock}</p>
            </div>
          ))}
        </div>
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
