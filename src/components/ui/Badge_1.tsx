import React from 'react';
import { cn } from '../../lib/cn';

const SIZES = {
  sm: 'px-2 text-[10px]',
  md: 'px-2.5 text-[11px]',
} as const;

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: keyof typeof SIZES;
};

/* Tmavý štítek s velkými písmeny (např. "4. SLUŽBA") */
export const Badge: React.FC<BadgeProps> = ({ size = 'md', className, ...props }) => (
  <span
    className={cn(
      'py-0.5 bg-loyo-ink text-white font-mono font-black uppercase tracking-wider rounded',
      SIZES[size],
      className,
    )}
    {...props}
  />
);
