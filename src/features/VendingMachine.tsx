import React from 'react';
import CoinButton from '../components/CoinButton';
import ProductSlot from '../components/ProductSlot';
import DisplayScreen from '../components/DisplayScreen';
import ControlPanel from '../components/ControlPanel';
import { COINS, DRINK_IMAGES } from '../constants';

import { useVendingMachine } from '../hooks/useVendingMachine';

import { formatAmount } from '../utils/convertToDollarValue';

const VendingMachine: React.FC = () => {
  const {
    machineState,
    message,
    balance,
    currency,
    handleDeposit,
    handleSelectProduct,
    handlePurchase,
    handleCancel,
  } = useVendingMachine();

  return (
    <div className="vendingMachineWrapper">
      <div>
        <DisplayScreen message={message} balance={balance} />

        <h3>Insert Coins</h3>
        <div className="coinContainer">
          {COINS.map(coin => (
            <div className="coinItem">
              <CoinButton
                key={coin}
                type={coin}
                onClick={() => handleDeposit(coin)}
                currency={currency}
              />
              {/* <img src={COIN_IMAGES[currency][coin]} alt={`${coin} coin`} /> */}
            </div>
          ))}
        </div>
        {/* <h3>2. Select your drink!</h3> */}
        {machineState.products.map(p => (
          <div className="productItem">
            <ProductSlot
              key={p.name}
              product={p}
              onClick={() => handleSelectProduct(p)}
            />
          </div>
        ))}
        <ControlPanel onPurchase={handlePurchase} onCancel={handleCancel} />
      </div>

      <div className="productGrid">
        {machineState.products.map(p => (
          <div key={p.name} className="productItem">
            <div
              className={`productImageWrapper ${p.stock === 0 ? 'soldOut' : ''}`}
            >
              <img
                src={DRINK_IMAGES[p.key]}
                alt={`${p.name}`}
                className="productImage"
              />
              {p.stock === 0 && <div className="soldOutOverlay">Sold Out</div>}
            </div>
            <p>
              {p.machineKey}. {p.name} - {formatAmount(p.price)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendingMachine;
