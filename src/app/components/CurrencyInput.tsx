import React, { useCallback, useState } from 'react';

type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, reais: number) => any;
};

export default function CurrencyInput(props: CurrencyInputProps) {
  const convertValueToBrl = useCallback((value: number) => {
    return value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }, []);

  const [inputValue, setInputValue] = useState(
    typeof props.value === 'number'
      ? convertValueToBrl(props.value)
      : props.value
  );

  return (
    <input
      className="ant-input"
      {...props}
      value={inputValue}
      onChange={(e) => {
        const { value } = e.currentTarget;
        const cents = value.replace(/[^(0-9)]/gi, '');
        const reais = Number(cents) / 100;

        setInputValue(convertValueToBrl(reais));

        props.onChange && props.onChange(e, reais);
      }}
    />
  );
}
