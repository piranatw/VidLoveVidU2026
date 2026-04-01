import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    className?: string;
    accent?: 'pink' | 'blue';
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    required = false,
    className = '',
    accent = 'pink'
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
        <div ref={dropdownRef} className={clsx('relative', className)}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className={clsx(
                    'w-full px-4 py-3 rounded-xl border bg-white',
                    'flex items-center justify-between',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2',
                    isOpen
                        ? accent === 'pink'
                            ? 'border-retro-pink ring-2 ring-retro-pink/30'
                            : 'border-retro-blue ring-2 ring-retro-blue/30'
                        : 'border-nostalgia-200 hover:border-nostalgia-300',
                    !selectedOption && 'text-nostalgia-400'
                )}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-required={required}
            >
                <span className={clsx(
                    'text-left truncate',
                    selectedOption ? 'text-nostalgia-900' : 'text-nostalgia-400'
                )}>
                    {displayText}
                </span>
                <ChevronDown
                    className={clsx(
                        'w-5 h-5 transition-transform duration-200 ml-2 flex-shrink-0',
                        isOpen ? 'rotate-180' : '',
                        accent === 'pink' ? 'text-retro-pink' : 'text-retro-blue'
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={clsx(
                    'absolute z-50 mt-2 w-full',
                    'bg-white rounded-xl shadow-xl border',
                    'max-h-60 overflow-y-auto',
                    'animate-in fade-in slide-in-from-top-2 duration-200',
                    accent === 'pink' ? 'border-retro-pink/20' : 'border-retro-blue/20'
                )}>
                    <div className="py-2" role="listbox">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    'w-full px-4 py-3 text-left',
                                    'transition-colors duration-150',
                                    'hover:bg-nostalgia-50',
                                    value === option.value
                                        ? accent === 'pink'
                                            ? 'bg-retro-pink/10 text-retro-pink font-semibold'
                                            : 'bg-retro-blue/10 text-retro-blue font-semibold'
                                        : 'text-nostalgia-700'
                                )}
                                role="option"
                                aria-selected={value === option.value}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
