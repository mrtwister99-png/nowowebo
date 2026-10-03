import React from 'react';
import { cn } from '../../lib/cn';

const VARIANTS = {
  primary: 'bg-loyo-ink text-white hover:bg-loyo-blue',
  secondary: 'bg-loyo-bar hover:bg-loyo-ink hover:text-white border border-loyo-line',
} as const;

const SIZES = {
  md: 'px-3.5 py-2',
  lg: 'px-5 py-2.5',
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
};

/* Základní tlačítko. Vzhled (barvy, písmo, odsazení) je tady,
   rozložení (flex, gap ...) se předává přes className, protože se liší podle místa. */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => (
  <button
    className={cn(
      'font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer',
      VARIANTS[variant],
      SIZES[size],
      className,
    )}
    {...props}
  />
);
