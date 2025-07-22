import React, { useState, useEffect } from 'react';
import './CatalogStyle.css'; 


const Catalog = () => {
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Veri alınamadı, ağ yanıtı başarısız.');
        }
        const data = await response.json();
        
        
        setProducts(data);
        setFilteredProducts(data);

        
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(['All', ...uniqueCategories]);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  
  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  
  if (isLoading) {
    return <div className="CatalogContainer"><p className="status-info">Katalog yükleniyor...</p></div>;
  }

  
  if (error) {
    return <div className="CatalogContainer"><p className="status-info">Hata: {error}</p></div>;
  }

  
  return (
    <div className="CatalogContainer">
      <h2 className="catalog-title">Mağaza Kataloğu</h2>

      
      <div className="CategoryFilter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

     
      <div className="ProductGrid">
        {filteredProducts.map(product => (
          <div key={product.id} className="ProductCard" onClick={() => openModal(product)}>
            <div className="card-image-container">
              <img src={product.image} alt={product.title} className="card-image" />
            </div>
            <div className="card-info">
              <h3 className="card-title">{product.title}</h3>
              <p className="card-price">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      
      {selectedProduct && (
        <div className="ModalOverlay" onClick={closeModal}>
          <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>×</button>
            <div className="modal-image-container">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="modal-image" />
            </div>
            <div className="modal-details">
              <h2 className="modal-title">{selectedProduct.title}</h2>
              <p className="modal-price">${selectedProduct.price.toFixed(2)}</p>
              <p className="modal-description">{selectedProduct.description}</p>
              <div className="modal-rating">
                <span className="rating-score">
                  ⭐ {selectedProduct.rating.rate}
                </span>
                <span className="rating-count">
                  ({selectedProduct.rating.count} değerlendirme)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;