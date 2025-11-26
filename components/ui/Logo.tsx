import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'light' }) => {
  // Brand Colors
  const limeColor = "#A3E635";
  const textColor = variant === 'light' ? "#FFFFFF" : "#18181b"; // White or Zinc-900
  const iconInternalColor = variant === 'light' ? "#18181b" : "#FFFFFF"; // Contrast for the leaf inside circle

  return (
    <svg 
      width="469" 
      height="85" 
      viewBox="0 0 469 85" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EcoCultivo Logo"
    >
      {/* Icon: Circle with abstract leaf shape */}
      <circle cx="42.5" cy="42.5" r="42.5" fill={limeColor}/>
      <path 
        d="M42.5 72C42.5 72 28 52 24 40C21 30 28 18 38 20C40.5 20.5 42.5 28 42.5 28C42.5 28 44.5 20.5 47 20C57 18 64 30 61 40C57 52 42.5 72 42.5 72Z" 
        fill={iconInternalColor}
        opacity="0.9"
      />
      
      {/* Text: ECOCULTIVO - Constructed with SVG paths for pixel-perfect rendering or fallback to Text */}
      <text 
        x="100" 
        y="62" 
        fontFamily="Inter, sans-serif" 
        fontWeight="800" 
        fontSize="64" 
        letterSpacing="-3" 
        fill={textColor}
        style={{ textTransform: 'uppercase' }}
      >
        ECOCULTIVO
      </text>
    </svg>
  );
};

export default Logo;