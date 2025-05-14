import React from 'react';
import type { Product } from '../types/index';

interface ProductSlotProps {
  product: Product;
  onClick: () => void;
}

const ProductSlot: React.FC<ProductSlotProps> = ({ product, onClick }) => {
  return (
    <button onClick={onClick} disabled={product.stock === 0}>
      {product.name}: {product.price}¢{' '}
      {product.stock === 0 && '(Sorry out of stock)'}
    </button>
  );
};

export default ProductSlot;
