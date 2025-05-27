import React from 'react';
import CoinButton from '../components/CoinButton';
import ProductSlot from '../components/ProductSlot';
import DisplayScreen from '../components/DisplayScreen';
import ControlPanel from '../components/ControlPanel';
import DrinkDropTray from '../components/DrinkDropTray';
import { COINS, DRINK_IMAGES } from '../constants';
import bannerLogo from '../assets/logo.png';

import { useVendingMachine } from '../hooks/useVendingMachine';

import { formatAmount } from '../utils/convertToDollarValue';

const VendingMachine: React.FC = () => {
  const {
    showAdminDisplay,
    machineState,
    message,
    handleDeposit,
    handleSelectProduct,
    handlePurchase,
    handleCancel,
    droppedProduct,
  } = useVendingMachine();

  const { currency, products } = machineState;

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
            machineState={machineState}
            showAdminDisplay={showAdminDisplay}
          />

          <h3>Insert Coins</h3>
          <div className="coinContainer">
            {COINS.map(coin => (
              <div className="coinItem" key={coin}>
                <CoinButton
                  key={coin}
                  type={coin}
                  onClick={() => handleDeposit(coin)}
                  currency={currency}
                />
              </div>
            ))}
          </div>
          {products.map(p => (
            <ProductSlot
              key={p.name}
              product={p}
              onClick={() => handleSelectProduct(p)}
            />
          ))}
          <ControlPanel onPurchase={handlePurchase} onCancel={handleCancel} />

          <DrinkDropTray droppedProduct={droppedProduct} isMobile />
        </div>

        <div>
          <img
            src={bannerLogo}
            alt="Crisp Vending Machine Banner"
            className="banner banner-desktop"
          />
          <div className="productGrid">
            {products.map(p => (
              <div key={p.name} className="productItem">
                <div
                  className={`productImageWrapper ${p.stock === 0 ? 'soldOut' : ''}`}
                  onClick={() => handleSelectProduct(p)}
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

          <DrinkDropTray droppedProduct={droppedProduct} isMobile={false} />
        </div>
      </div>
    </div>
  );
};

export default VendingMachine;
