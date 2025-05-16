import React from 'react';
import type { Product } from '../types/index';

interface ProductSlotProps {
  product: Product;
  onClick: () => void;
}

const ProductSlot: React.FC<ProductSlotProps> = ({ product, onClick }) => {
  return (
    <button onClick={onClick}>
      {product.name}: {product.price}¢{' '}
    </button>
  );
};

export default ProductSlot;
