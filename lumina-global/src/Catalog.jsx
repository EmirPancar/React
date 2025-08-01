import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchProducts, setCategory, setSelectedProduct } from './redux/catalogSlice';
import { addToCart } from './redux/cartSlice';
import './redux/store';
import './CatalogStyle.css';

const Catalog = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const {
    products,
    categories,
    selectedCategory,
    selectedProduct,
    status,
    error
  } = useSelector((state) => state.catalog);

  const TL_EXCHANGE_RATE = 40; 

  const formatPrice = (priceInUsd) => {
    if (i18n.language === 'tr') {
      const priceInTry = (priceInUsd * TL_EXCHANGE_RATE).toFixed(2);
      return `₺${priceInTry}`;
    }

    return `$${priceInUsd.toFixed(2)}`;
  };


  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
  };

  const openModal = (product) => {
    dispatch(setSelectedProduct(product));
    setQuantity(1);
  };

  const closeModal = () => {
    dispatch(setSelectedProduct(null));
  };

  const handleAddToCart = (product) => {
    const finalQuantity = quantity < 1 ? 1 : quantity;
    dispatch(addToCart({ ...product, quantity: finalQuantity }));
    closeModal();
  };

  if (status === 'loading') {
    return <div className="CatalogContainer"><p className="status-info">{t('loadingCatalog')}</p></div>;
  }

  if (status === 'failed') {
    return <div className="CatalogContainer"><p className="status-info">{t('error')}: {error}</p></div>;
  }

  return (
    <div className="CatalogContainer">
      <h2 className="catalog-title">{t('storeCatalog')}</h2>

      <div className="CategoryFilter">
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {t(category)}
          </button>
        ))}
      </div>

      <div className="ProductGrid">
        {filteredProducts.map(product => (
          <div key={product.id} className="ProductCard" onClick={() => openModal(product)}>
            <div className="card-image-container">
              <img src={product.image} alt={t(`product_${product.id}_title`)} className="card-image" />
            </div>
            <div className="card-info">
              <h3 className="card-title">{t(`product_${product.id}_title`)}</h3>
              <p className="card-price">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="ModalOverlay" onClick={closeModal}>
          <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>×</button>
            <div className="modal-image-container">
              <img src={selectedProduct.image} alt={t(`product_${selectedProduct.id}_title`)} className="modal-image" />
            </div>
            <div className="modal-details">
              <h2 className="modal-title">{t(`product_${selectedProduct.id}_title`)}</h2>
              <p className="modal-price">{formatPrice(selectedProduct.price)}</p>
              <p className="modal-description">{t(`product_${selectedProduct.id}_description`)}</p>
              <div className="modal-rating">
                <span className="rating-score">
                  ⭐ {selectedProduct.rating.rate}
                </span>
                <span className="rating-count">
                  ({selectedProduct.rating.count} {t('reviews')})
                </span>
              </div>
              
              <div className="quantity-selector">
                <button 
                  className="quantity-button" 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="quantity-input" 
                  value={quantity} 
                  onChange={(e) => {
                    const numValue = Number(e.target.value);
                    setQuantity(numValue < 1 ? 1 : numValue);
                  }}
                  min="1" 
                />
                <button 
                  className="quantity-button" 
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(selectedProduct)}
              >
                {t('addToCart')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;