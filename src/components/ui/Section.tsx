import React from 'react';
import { cn } from '../../lib/cn';

/* Obálka sekce na hlavní stránce: max. šířka 6xl, vycentrovaná, s bočním odsazením.
   Svislé odsazení (pt-*, pb-*) se předává přes className. */
export const Section: React.FC<React.HTMLAttributes<HTMLElement>> = ({ className, ...props }) => (
  <section
    className={cn('w-full max-w-6xl mx-auto px-4 sm:px-6 select-none', className)}
    {...props}
  />
);
