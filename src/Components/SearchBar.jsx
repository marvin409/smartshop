import React, { useState } from "react";

const SearchBar = ({ products }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      // Filter products by name or category
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.category.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // show top 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (name) => {
    setQuery(name);
    setSuggestions([]);
    // Redirect to product search results page
    window.location.href = `/products?search=${name}`;
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li key={item.id} onClick={() => handleSelect(item.name)}>
              {item.name} <span className="suggestion-category">({item.category})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
