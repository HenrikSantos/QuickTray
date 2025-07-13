import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full border mt-2 border-gray-700 rounded-md bg-gray-800 px-3 py-2 text-sm shadow-custom ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input"

export { Input }
