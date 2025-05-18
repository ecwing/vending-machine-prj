import React from 'react';
import type { Product } from '../types/index';

interface ProductSlotProps {
  product: Product;
  onClick: () => void;
}

const ProductSlot: React.FC<ProductSlotProps> = ({ product, onClick }) => {
  return (
    <button onClick={onClick} className="vendingButton">
      {product.machineKey}
    </button>
  );
};

export default ProductSlot;
