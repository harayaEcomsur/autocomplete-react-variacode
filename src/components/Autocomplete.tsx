import React, { useState, useEffect, ChangeEvent } from 'react';
import { mockData } from '../data/mockData';

interface AutoCompleteProps {
    placeholder?: string;
    source: 'mock' | 'api';
}

const cache: { [key: string]: string[] } = {};

const AutoComplete: React.FC<AutoCompleteProps> = ({ placeholder, source }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length === 0) {
                setSuggestions([]);
                setNoResults(false);
                return;
            }

            if (cache[query]) {
                setSuggestions(cache[query]);
                setNoResults(cache[query].length === 0);
                return;
            }

            let data: string[] = [];

            if (source === 'mock') {
                data = mockData.filter(item =>
                    item.toLowerCase().includes(query.toLowerCase())
                );
            } else if (source === 'api') {
                try {
                    const response = await fetch('https://api.sampleapis.com/simpsons/characters');
                    const characters = await response.json();
                    data = characters.map((character: { name: string }) => character.name)
                        .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()));
                } catch (error) {
                    console.error("Error fetching data from API:", error);
                }
            }

            cache[query] = data;
            setSuggestions(data);
            setNoResults(data.length === 0);
        };

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const newTimeout = window.setTimeout(fetchSuggestions, 300);
        setDebounceTimeout(newTimeout);

        return () => {
            if (newTimeout) {
                clearTimeout(newTimeout);
            }
        };
    }, [query, source]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setHighlightIndex(-1);
        setNoResults(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            setHighlightIndex(prevIndex =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === 'ArrowUp') {
            setHighlightIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
        } else if (e.key === 'Enter' && highlightIndex >= 0) {
            setQuery(suggestions[highlightIndex]);
            setTimeout(() => {
                setSuggestions([]);
            }, 0);
            setHighlightIndex(-1);
        }
    };

    const handleClickSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        setTimeout(() => {
            setSuggestions([]);
        }, 0);
        setHighlightIndex(-1);
    };

    const highlightText = (text: string) => {
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <strong key={index} style={{ color: 'red' }}>{part}</strong>
            ) : (
                part
            )
        );
    };

    return (
        <div className="autocomplete">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoComplete="off"
                style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', margin: '10px 0' }}
            />
            {noResults && (
                <div style={{ marginTop: '5px', color: 'red' }}>
                    No se han encontrado coincidencias.
                </div>
            )}
            {suggestions.length > 0 && (
                <ul className="suggestions" style={{ listStyle: 'none', padding: 0, marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px', maxHeight: '150px', overflowY: 'auto' }}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleClickSuggestion(suggestion)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            {highlightText(suggestion)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoComplete;
