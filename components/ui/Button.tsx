import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 px-8 py-3 text-sm md:text-base";
  
  const variants = {
    primary: "bg-lime-400 hover:bg-lime-300 text-zinc-900",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300",
    outline: "bg-transparent border border-white text-white hover:bg-white/10",
    dark: "bg-zinc-900 text-white hover:bg-zinc-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} group`} 
      {...props}
    >
      {children}
      {icon && <span className="ml-2 group-hover:translate-x-1 transition-transform">{icon}</span>}
    </button>
  );
};

export default Button;