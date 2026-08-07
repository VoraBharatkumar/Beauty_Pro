'use client';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-luna-dark">
          {label}
          {props.required && <span className="text-luna-coffee ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luna-coffee/60">
            {icon}
          </div>
        )}
        <motion.input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3.5 bg-white border-2 border-luna-peach/30 rounded-xl
            text-luna-dark placeholder:text-luna-dark/40
            focus:border-luna-rose-gold focus:ring-2 focus:ring-luna-rose-gold/20 focus:outline-none
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            ${className}
          `}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-luna-dark/50">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

