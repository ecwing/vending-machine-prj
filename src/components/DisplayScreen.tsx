import React from 'react';
import { formatAmount } from '../utils/convertToDollarValue';
import type { MachineState, Product } from '../types/index';
interface DisplayScreenProps {
  machineState: MachineState;
  message: string;
  balance: number;
  remainingBalance: number;
  selectedProduct: Product | null;
  showAdminDisplay: boolean;
}

const DisplayScreen: React.FC<DisplayScreenProps> = ({
  machineState,
  message,
  balance,
  remainingBalance,
  selectedProduct,
  showAdminDisplay,
}) => {
  const isLongMessage = message.length > 26;

  return (
    <div className="displayWrapper">
      <div className="scrollingMessageWrapper">
        <div className={isLongMessage ? 'scrollingMessage' : 'staticMessage'}>
          {message}
        </div>
      </div>
      {!showAdminDisplay && (
        <div className="displayBalance">{`balance: ${formatAmount(balance)}`}</div>
      )}
      {selectedProduct && !showAdminDisplay && (
        <div className="displayText">
          Remaining for {selectedProduct.name}: {formatAmount(remainingBalance)}
        </div>
      )}
      {showAdminDisplay && (
        <div className="adminDisplay">
          <h4>User/coin balance state:</h4>
          <div className="adminDisplayContainer">
            <p>{`balance: ${formatAmount(balance)}`}</p>
            <p>Nickels: {machineState.coinInventory.nickel}</p>
            <p>Dimes: {machineState.coinInventory.dime}</p>
            <p>Quarters: {machineState.coinInventory.quarter}</p>
          </div>
          <h4>Product Inventory:</h4>
          <div className="adminDisplayContainer">
            {machineState.products.map(product => (
              <div key={product.name}>
                <p>
                  {product.name} - {product.stock}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayScreen;
