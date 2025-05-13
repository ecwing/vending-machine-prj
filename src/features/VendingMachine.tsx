import React, { useState } from 'react'
import CoinButton from '../components/CoinButton'
import ProductSlot from '../components/ProductSlot'
import DisplayScreen from '../components/DisplayScreen'
import ControlPanel from '../components/ControlPanel'
import { initialMachineState, products } from './dataTypes'
import type { MachineState } from '../types/index'

const VendingMachine: React.FC = () => {
  const [machineState, setMachineState] = useState<MachineState>(initialMachineState)
  const [message, setMessage] = useState<string>('INSERT COINS')


  return (
    <div>
      <DisplayScreen message={message} />
      <div>
        <h2>Deposit Coins</h2>
        <CoinButton type="nickel" />
        <CoinButton type="dime" />
        <CoinButton type="quarter" />
      </div>
      <div>
        <h2>Select your drink!</h2>
        {products.map((product) => (
          <ProductSlot key={product.name} product={product} />
        ))}
      </div>
      <ControlPanel />
    </div>
  )
}

export default VendingMachine