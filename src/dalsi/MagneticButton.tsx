import React, { useRef, useState, useCallback } from 'react';
import { BRAND } from '../lib/colors';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number; // How far the button moves (0.1 to 0.45)
  showCornerSquares?: boolean; // Whether to display subtle technical corner "čtverečky"
  squareColor?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  magneticStrength = 0.28,
  showCornerSquares = true,
  squareColor = BRAND.ink,
  onMouseMove,
  onMouseLeave,
  onClick,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * magneticStrength;
      const deltaY = (e.clientY - centerY) * magneticStrength;

      setPosition({ x: deltaX, y: deltaY });
      setIsHovered(true);

      if (onMouseMove) onMouseMove(e);
    },
    [magneticStrength, onMouseMove],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
      if (onMouseLeave) onMouseLeave(e);
    },
    [onMouseLeave],
  );

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-magnetic="true"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.12s ease-out'
          : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`relative group ${className}`}
      {...rest}
    >
      {/* Subtle architectural corner "čtverečky" on magnetic button */}
      {showCornerSquares && (
        <>
          {/* Top-Left square */}
          <span
            className="absolute -top-1 -left-1 w-1.5 h-1.5 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: squareColor,
              opacity: isHovered ? 1 : 0.4,
              transform: isHovered ? 'scale(1.25)' : 'scale(1)',
            }}
          />
          {/* Top-Right square */}
          <span
            className="absolute -top-1 -right-1 w-1.5 h-1.5 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: squareColor,
              opacity: isHovered ? 1 : 0.4,
              transform: isHovered ? 'scale(1.25)' : 'scale(1)',
            }}
          />
          {/* Bottom-Left square */}
          <span
            className="absolute -bottom-1 -left-1 w-1.5 h-1.5 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: squareColor,
              opacity: isHovered ? 1 : 0.4,
              transform: isHovered ? 'scale(1.25)' : 'scale(1)',
            }}
          />
          {/* Bottom-Right square */}
          <span
            className="absolute -bottom-1 -right-1 w-1.5 h-1.5 pointer-events-none transition-all duration-300"
            style={{
              backgroundColor: squareColor,
              opacity: isHovered ? 1 : 0.4,
              transform: isHovered ? 'scale(1.25)' : 'scale(1)',
            }}
          />
        </>
      )}

      {/* Button content */}
      {children}
    </button>
  );
};
