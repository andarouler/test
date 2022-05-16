import React from 'react';

interface Props {
  border: string;
  color: string;
  background: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => any;
  radius: string
  width: string;
  cursor: string;
  fontSize: string;
}

const Button: React.FC<Props> = ({ 
    border,
    color,
    background,
    children,
    height,
    onClick, 
    radius,
    width,
    cursor,
    fontSize
  }) => { 
  return (
    <button 
      onClick={onClick}
      style={{
         color: color,
         background: background,
         border,
         borderRadius: radius,
         height,
         width,
         cursor,
         fontSize
      }}
    >
    {children}
    </button>
  );
}

export default Button;
