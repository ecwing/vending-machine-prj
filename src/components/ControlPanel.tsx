import React from 'react'

interface ControlPanelProps {
    onPurchase: () => void
    onCancel: () => void
  }

const ControlPanel: React.FC<ControlPanelProps> = ({ onPurchase, onCancel }) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={onPurchase}>PURCHASE</button>
      <button onClick={onCancel} style={{ marginLeft: '1rem' }}>
        CANCEL
      </button>
    </div>
  )
}

export default ControlPanel