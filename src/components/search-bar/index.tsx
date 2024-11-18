import React, { useState } from "react";
import cl from './index.module.scss';

type SearchBarProps = {
    onSelect: (city: string) => void;
    searchResults?: { name: string }[];
    onSearch: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, searchResults, onSearch }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onSearch(value);
    };

    const handleSelect = (city: string) => {
        setInputValue("");
        onSearch("");
        onSelect(city);
        window.scrollTo(0, 0)
    };

    const showVariants = inputValue.trim().length > 2 && searchResults && searchResults.length > 0;

    return (
        <div className={cl.wrapper}>
            <input
                className={cl.input}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Search city..."
            />
            {showVariants && (
                <div className={cl.variants}>
                    <h3 className={cl.title}>Variants:</h3>
                    <ul>
                        {searchResults.map((result, index) => (
                            <li
                                className={cl.points}
                                key={index}
                                onClick={() => handleSelect(result.name)}
                            >
                                {result.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
