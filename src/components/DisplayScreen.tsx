import React from 'react';

interface DisplayScreenProps {
  message: string;
}

const DisplayScreen: React.FC<DisplayScreenProps> = ({ message }) => {
  return (
    <div
      style={{
        margin: '25px 0',
        fontWeight: 'bold',
      }}
    >
      {message}
    </div>
  );
};

export default DisplayScreen;
