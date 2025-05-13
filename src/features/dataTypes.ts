import type { MachineState } from '../types/index'

export const products = [
  { name: 'Cola', price: 25, stock: 10 },
  { name: 'Diet Cola', price: 35, stock: 8 },
  { name: 'Lime Soda', price: 25, stock: 0 },
  { name: 'Water', price: 45, stock: 2 },
]

export const initialMachineState: MachineState = {
  balance: 0,
  coinInventory: {
    nickel: 5,
    dime: 5,
    quarter: 5,
  },
  products,
}