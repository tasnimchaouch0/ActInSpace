import React, { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'default' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-green-700 text-white hover:bg-green-800',
  ghost: 'bg-transparent text-green-700 hover:bg-green-100 border border-transparent',
  outline: 'bg-transparent text-green-700 border border-green-700 hover:bg-green-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({ children, variant = 'default', size = 'md', className = '', ...props }: ButtonProps) => (
  <button
    className={`rounded transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
