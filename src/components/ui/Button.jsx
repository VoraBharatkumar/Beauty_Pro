'use client';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  magnetic = true,
  ...props
}, ref) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-500 overflow-hidden group tracking-wider uppercase select-none';

  const variants = {
    primary: 'bg-beauty-dark text-white hover:bg-beauty-brown luxury-shadow hover:luxury-shadow-lg',
    secondary: 'bg-white text-beauty-dark border-2 border-beauty-dark hover:bg-beauty-dark hover:text-white',
    outline: 'bg-transparent text-beauty-rose-gold border border-beauty-rose-gold hover:bg-beauty-rose-gold hover:text-white',
    ghost: 'bg-transparent text-beauty-dark hover:bg-beauty-beige',
    gold: 'gold-gradient text-beauty-dark hover:opacity-90 luxury-shadow',
    rose: 'bg-beauty-rose-gold text-white hover:bg-beauty-coffee luxury-shadow',
    dark: 'bg-beauty-dark text-white hover:bg-beauty-brown',
    link: 'bg-transparent text-beauty-rose-gold hover:text-beauty-coffee underline-offset-4 hover:underline p-0',
    'outline-white': 'bg-transparent text-white border border-white/40 hover:bg-white hover:text-beauty-dark',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px] md:text-xs rounded-full',
    md: 'px-7 py-3 text-xs md:text-sm rounded-full',
    lg: 'px-9 py-3.5 text-sm md:text-base rounded-full',
    xl: 'px-12 py-4 text-base md:text-lg rounded-full',
    icon: 'p-3 rounded-full',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </span>
      {variant !== 'link' && variant !== 'outline-white' && (
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-beauty-rose-gold to-beauty-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </>
  );

  const magneticEffect = (e) => {
    if (!magnetic) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const resetMagnetic = (e) => {
    if (!magnetic) return;
    e.currentTarget.style.transform = 'translate(0, 0)';
  };

  if (href) {
    return (
      <Link
        href={href}
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      onClick={onClick}
      onMouseMove={magneticEffect}
      onMouseLeave={resetMagnetic}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {content}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;