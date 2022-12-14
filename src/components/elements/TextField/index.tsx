// hello
import React, { ComponentProps, JSXElementConstructor } from 'react';

interface TextFieldProps {
  type?: string;
  placeholder?: string;
  value?: string | number | undefined;
  onClick?: () => void;
  error?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  success?: boolean;
  label?: string;
  inputRef?: string;
  message?: string;
  props?: ComponentProps<JSXElementConstructor<any>>;
  inputClass?: string;
  disabled?: boolean;
}
const TextField: React.FC<TextFieldProps> = ({
  type,
  placeholder,
  value,
  onClick,
  error,
  className,
  onChange,
  name,
  label,
  inputRef,
  message,
  inputClass,
  props,
  disabled,
}) => {
  return (
    <div>
      <div>
        {label && (
          <label
            className="text-primary font-bold"
            style={{ color: error ? '#e11900 ' : '0' }}
          >
            {label}
          </label>
        )}

        <div
          className={[
            className,
            `rounded w-full h-12 my-1 focus:border-primary ${
              error ? 'border-red-500' : '0'
            }`,
          ].join(' ')}
        >
          <input
            type={type || 'text'}
            className={[
              inputClass,
              'bg-transparent outline-none rounded py-4 h-12 w-full focus:border-primary transition-all duration-200 ease-in-out ',
            ].join(' ')}
            placeholder={placeholder || 'this is a placeholder'}
            value={value}
            onClick={onClick}
            error={error}
            onChange={onChange}
            name={name}
            disabled={disabled}
            ref={inputRef}
            {...props}
          />
        </div>
      </div>
      {error && <small style={{ color: '#e11900' }}>{message}</small>}
    </div>
  );
};

export default TextField;
