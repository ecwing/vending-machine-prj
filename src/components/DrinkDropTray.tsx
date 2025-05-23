import React from 'react';

import { DRINK_IMAGES } from '../constants';

import type { Product } from '../types/index';

interface DrinkDropTrayProps {
  droppedProduct: Product | null;
  isMobile: boolean;
}

const DrinkDropTray: React.FC<DrinkDropTrayProps> = ({
  droppedProduct,
  isMobile,
}) => {
  return (
    <div
      className={`productDropTray ${isMobile ? 'dropTrayMobile' : 'dropTrayDesktop'}`}
    >
      <div className={`dropOpening ${droppedProduct ? 'openFlap' : ''}`}>
        {droppedProduct && (
          <img
            src={DRINK_IMAGES[droppedProduct.key]}
            alt={`${droppedProduct.name} dropped`}
            className="droppedProductImage"
          />
        )}
        <div className="flap">push</div>
      </div>
    </div>
  );
};

export default DrinkDropTray;
