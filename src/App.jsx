// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'https://fakestoreapi.com';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/products/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(setError);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory
      ? `${API_BASE}/products/category/${selectedCategory}`
      : `${API_BASE}/products`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
        setSelectedProduct(null);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, [selectedCategory]);

  useEffect(() => {
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  return (
    <div className="App">
      <h1> Fake Store Product Explorer</h1>

      {error && <p className="error">{error}</p>}

      <div className="controls">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(prod => (
            <div
              key={prod.id}
              className={`product-card ${selectedProduct?.id === prod.id ? 'active' : ''}`}
              onClick={() => setSelectedProduct(prod)}
            >
              <img src={prod.image} alt={prod.title} />
              <h3>{prod.title}</h3>
              <p className="price">${prod.price}</p>
              <small className="category">{prod.category}</small>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="product-detail">
          <h2>{selectedProduct.title}</h2>
          <img src={selectedProduct.image} alt={selectedProduct.title} className="detail-img" />
          <p className="description">{selectedProduct.description}</p>
          <p className="rating">⭐ {selectedProduct.rating.rate} / 5 ({selectedProduct.rating.count} reviews)</p>
          <p className="price-detail">💲 {selectedProduct.price}</p>
        </div>
      )}
    </div>
  );
}

export default App;

