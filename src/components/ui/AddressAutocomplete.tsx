'use client';

import { useState, useRef, useCallback } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (details: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface Suggestion {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/address/autocomplete?input=${encodeURIComponent(input)}`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Debounce API calls
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(newValue), 300);
  };

  const handleSelect = async (suggestion: Suggestion) => {
    setShowSuggestions(false);
    onChange(suggestion.description);

    if (onSelect) {
      // Get full details
      try {
        const response = await fetch(
          `/api/address/details?placeId=${suggestion.placeId}`
        );

        if (response.ok) {
          const details = await response.json();
          onSelect(details);
        } else {
          onSelect({ address: suggestion.description });
        }
      } catch {
        onSelect({ address: suggestion.description });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />

      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <i className="fas fa-spinner fa-spin text-gray-500" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition flex items-start gap-3"
            >
              <i className="fas fa-map-marker-alt text-aire-400 mt-1" />
              <div>
                <div className="text-white font-medium">{suggestion.mainText}</div>
                <div className="text-gray-400 text-sm">{suggestion.secondaryText}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
