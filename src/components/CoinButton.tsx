import React from 'react';
import type { Coin } from '../types';
import { coinValues } from '../features/data';

interface CoinButtonProps {
  type: Coin;
  onClick: () => void;
}

const CoinButton: React.FC<CoinButtonProps> = ({ type, onClick }) => {
  const label = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${coinValues[type]}¢`;

  return (
    <button onClick={onClick} aria-label={label}>
      {coinValues[type]}¢
    </button>
  );
};

export default CoinButton;
