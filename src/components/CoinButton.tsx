import React from 'react'
import type { Coin } from '../types/index'

interface CoinButtonProps {
  type: Coin
}

const CoinButton: React.FC<CoinButtonProps> = ({ type }) => {
  const handleClick = () => {
    console.log(`Deposit: ${type}`)

    // deposit logic will go here here

  }

  return <button onClick={handleClick}>{type}</button>
}

export default CoinButton