import React, { forwardRef } from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 checked:bg-[#ae5630] data-[state=unchecked]:bg-gray-700 relative ${className}`}
    ref={ref}
    {...props}
  />
));

Switch.displayName = 'Switch';

export { Switch };
