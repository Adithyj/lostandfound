import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
    const [searchParams, setSearchParams] = useState({
        name: '',
        category: '',
        brand: '',
        color: ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    };

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:5000/api/search/search', {
                params: searchParams,
            });
            setSearchResults(response.data.items || []);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('There was an error fetching the results. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-bar">
            <h2>Search Items</h2>
            <div className="search-inputs">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={searchParams.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={searchParams.category}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={searchParams.brand}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={searchParams.color}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Display loading or error messages */}
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display search results */}
            <div className="search-results">
                {searchResults.length > 0 ? (
                    <div className="results-list">
                        {searchResults.map((item) => (
                            <div className="result-item" key={item.ITEM_ID}>
                                <h3>{item.NAME}</h3>
                                <div><strong>Brand:</strong> {item.BRAND}</div>
                                <div><strong>Category:</strong> {item.CATEGORY}</div>
                                <div><strong>Color:</strong> {item.COLOR}</div>
                                <div><strong>Size:</strong> {item.SIZE}</div>
                                <div><strong>Status:</strong> {item.STATUS}</div>
                                <div><strong>Created At:</strong> {new Date(item.CREATED_AT).toLocaleString()}</div>
                                <div>
                                    {item.IMAGE ? (
                                        <img src={item.IMAGE} alt={item.NAME} />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
