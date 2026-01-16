import React from 'react';

interface Props {
    value: number;
    onChange: (value: number) => void;
    className?: string; // To allow passing the existing Tailwind classes
    placeholder?: string;
    step?: number;
}

export default function MoneyInput({ value, onChange, className = "", placeholder, step }: Props) {
    // Format number to string with commas
    const formatValue = (num: number) => {
        return num === 0 && !value ? '' : new Intl.NumberFormat('en-US').format(num);
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove commas and convert to number
        const rawValue = e.target.value.replace(/,/g, '');
        const numValue = Number(rawValue);

        if (!isNaN(numValue)) {
            onChange(numValue);
        }
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                className={`${className} pr-8`}
                value={value === 0 ? '' : formatValue(value)}
                onChange={handleChange}
                placeholder={placeholder}
                inputMode="numeric"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold pointer-events-none">
                円
            </span>
        </div>
    );
}
