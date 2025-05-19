import React from 'react';
import { formatAmount } from '../utils/convertToDollarValue';
import type { Product } from '../types/index';
interface DisplayScreenProps {
  message: string;
  balance: number;
  remainingBalanceOnItem: number;
  selectedProduct: Product | null;
}

const DisplayScreen: React.FC<DisplayScreenProps> = ({
  message,
  balance,
  remainingBalanceOnItem,
  selectedProduct,
}) => {
  const isLongMessage = message.length > 30;

  return (
    <div className="displayWrapper">
      <div className="scrollingMessageWrapper">
        <div className={isLongMessage ? 'scrollingMessage' : 'staticMessage'}>
          {message}
        </div>
      </div>
      <div className="displayBalance">{`balance: ${formatAmount(balance)}`}</div>
      {selectedProduct && (
        <div className="displayText">
          Remaining for {selectedProduct.name}:{' '}
          {formatAmount(remainingBalanceOnItem)}
        </div>
      )}
    </div>
  );
};

export default DisplayScreen;
