import React from 'react';
import type { Coin } from '../types';

interface CoinButtonProps {
  type: Coin;
  onClick: () => void;
}

const CoinButton: React.FC<CoinButtonProps> = ({ type, onClick }) => {
  return <button onClick={onClick}>{type}</button>;
};

export default CoinButton;
