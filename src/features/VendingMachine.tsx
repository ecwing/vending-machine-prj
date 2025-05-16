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
  } = useVendingMachine();

  return (
    <div>
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
    </div>
  );
};

export default VendingMachine;
