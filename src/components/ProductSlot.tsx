import React from 'react';
import type { Product } from '../types/index';

interface ProductSlotProps {
  product: Product;
  onClick: () => void;
}

const ProductSlot: React.FC<ProductSlotProps> = ({ product, onClick }) => {
  return (
    <div className="productSlotWrapper">
      <button
        onClick={onClick}
        className="vendingButton"
        aria-label={product.machineKey}
      >
        {product.machineKey}
      </button>
      <button
        onClick={onClick}
        className="productNameButton"
        aria-label={product.name}
      >
        {product.name}
      </button>
    </div>
  );
};

export default ProductSlot;
