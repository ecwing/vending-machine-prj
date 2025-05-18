import React from 'react';
import type { Coin, currency } from '../types';
import { coinValues } from '../features/data';

import { COIN_IMAGES } from '../constants';

interface CoinButtonProps {
  type: Coin;
  onClick: () => void;
  currency: currency;
}

const CoinButton: React.FC<CoinButtonProps> = ({ type, onClick, currency }) => {
  const label = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${coinValues[type]}¢`;

  return (
    <button onClick={onClick} aria-label={label} className="coinButton">
      <span className="visuallyHidden">{label}</span>
      <img
        src={COIN_IMAGES[currency][type]}
        alt={`${type} coin`}
        className="coinImage"
      />
      <p>{coinValues[type]}¢</p>
    </button>
  );
};

export default CoinButton;
