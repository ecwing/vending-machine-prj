import React from 'react'

const ControlPanel: React.FC = () => {
  const handleCancel = () => {
    console.log('handleCancel hit')
   
     // cancel logic will go here


  }

  const handlePurchase = () => {
    console.log('handlePurchase hit')
    
    
    // purchase logic will go here


  }


  return (
    <div>
      <button onClick={handlePurchase}>PURCHASE</button>
      <button onClick={handleCancel} style={{ marginLeft: '1rem' }}>
        CANCEL
      </button>
    </div>
  )
}

export default ControlPanel