import React from 'react';

interface ControlPanelProps {
  onPurchase: () => void;
  onCancel: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onPurchase,
  onCancel,
}) => {
  return (
    <div className="controlPanelWrapper">
      <button onClick={onPurchase} className="controlButton">
        PURCHASE
      </button>
      <button onClick={onCancel} className="controlButton">
        CANCEL
      </button>
    </div>
  );
};

export default ControlPanel;
