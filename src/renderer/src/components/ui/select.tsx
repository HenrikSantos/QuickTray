import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      className={`flex h-10 w-full appearance-none items-center justify-between rounded-md bg-gray-800 pr-10 py-2 text-sm shadow-custom ring-offset-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-500 cursor-pointer ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
  </div>
));

Select.displayName = 'Select';

// Re-exporting option and optgroup for convenience
const SelectOption = (props: React.OptionHTMLAttributes<HTMLOptionElement>) => <option {...props} />;
const SelectOptGroup = (props: React.OptgroupHTMLAttributes<HTMLOptGroupElement>) => <optgroup {...props} />;

export { Select, SelectOption, SelectOptGroup };
