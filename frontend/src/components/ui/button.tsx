import React, { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const Button = ({ children, ...props }: ButtonProps) => (
  <button
    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors"
    {...props}
  >
    {children}
  </button>
);

export default Button;
