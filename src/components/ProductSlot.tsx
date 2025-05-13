import React from 'react'
import type { Product } from '../types/index'

interface ProductSlotProps {
  product: Product
}

const ProductSlot: React.FC<ProductSlotProps> = ({ product }) => {
  const handleSelect = () => {
    console.log(`handleSelect hit - Selected: ${product.name}`)

    // selection logic will go here

  }

  return (
    <button onClick={handleSelect} disabled={product.stock === 0}>
      {product.name}: {product.price}¢ {product.stock === 0 && '(Sorry out of stock)'}
    </button>
  )
}

export default ProductSlot