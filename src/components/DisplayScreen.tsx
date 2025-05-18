import React from 'react';
import { formatAmount } from '../utils/convertToDollarValue';

interface DisplayScreenProps {
  message: string;
  balance: number;
}

const DisplayScreen: React.FC<DisplayScreenProps> = ({ message, balance }) => {
  return (
    <div className="displayWrapper">
      <div className="displayText">{message}</div>
      <div className="displayText">{`balance: ${formatAmount(balance)}`}</div>
    </div>
  );
};

export default DisplayScreen;
