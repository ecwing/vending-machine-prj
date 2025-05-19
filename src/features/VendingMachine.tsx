import React from 'react';
import CoinButton from '../components/CoinButton';
import ProductSlot from '../components/ProductSlot';
import DisplayScreen from '../components/DisplayScreen';
import ControlPanel from '../components/ControlPanel';
import { COINS, DRINK_IMAGES } from '../constants';
import bannerLogo from '../assets/logo.png';

import { useVendingMachine } from '../hooks/useVendingMachine';

import { formatAmount } from '../utils/convertToDollarValue';

const VendingMachine: React.FC = () => {
  const {
    machineState,
    message,
    balance,
    remainingBalanceOnItem,
    currency,
    selectedProduct,
    handleDeposit,
    handleSelectProduct,
    handlePurchase,
    handleCancel,
  } = useVendingMachine();

  return (
    <div>
      <div className="vendingMachineWrapper">
        <h1 className="screen-reader-only">Crisp Vending Machine</h1>
        <div></div>
        <div>
          <img
            src={bannerLogo}
            alt={'Crisp Vending Machine Banner'}
            className="banner banner-mobile"
          />

          <DisplayScreen
            message={message}
            balance={balance}
            remainingBalanceOnItem={remainingBalanceOnItem}
            selectedProduct={selectedProduct}
          />

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
              </div>
            ))}
          </div>
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

        <div>
          <img
            src={bannerLogo}
            alt="Crisp Vending Machine Banner"
            className="banner banner-desktop"
          />
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
                  {p.stock === 0 && (
                    <div className="soldOutOverlay">Sold Out</div>
                  )}
                </div>

                <p>
                  {p.machineKey}. {p.name} - {formatAmount(p.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendingMachine;
