import React from 'react';
import { cn } from '../../lib/cn';

/* Karta s tvrdým rámečkem (používá se na stránkách služeb).
   Skládá se z: Card > CardEyebrow + CardTitle + CardText + CardNote */

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('bg-loyo-bar border-2 border-loyo-ink p-6 shadow-xs', className)} {...props} />
);

const EYEBROW_TONES = {
  ink: 'text-loyo-ink',
  blue: 'text-loyo-blue',
  red: 'text-loyo-red',
  mustard: 'text-loyo-mustard-dark',
} as const;

type CardEyebrowProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Barva štítku nad nadpisem karty */
  tone?: keyof typeof EYEBROW_TONES;
};

/** Malý štítek s ikonou nad nadpisem karty */
export const CardEyebrow: React.FC<CardEyebrowProps> = ({ tone = 'ink', className, ...props }) => (
  <div
    className={cn(
      'flex items-center gap-2 text-xs font-mono font-bold uppercase mb-2',
      EYEBROW_TONES[tone],
      className,
    )}
    {...props}
  />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => <h3 className={cn('font-heading font-black text-xl text-loyo-ink', className)} {...props} />;

export const CardText: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => <p className={cn('text-xs text-loyo-body mt-2.5 leading-relaxed', className)} {...props} />;

/** Poznámka pod čárou na konci karty */
export const CardNote: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'mt-4 pt-3 border-t border-loyo-line text-[11px] font-mono text-loyo-muted',
      className,
    )}
    {...props}
  />
);
