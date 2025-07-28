import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  toggleCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart
} from './redux/cartSlice';
import { setSelectedProduct } from './redux/catalogSlice';
import './HeaderStyle.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const langDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const { cartItems, isCartOpen } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.catalog);

  const TL_EXCHANGE_RATE = 40; 

  const formatPrice = (priceInUsd) => {
    if (i18n.language === 'tr') {
      const priceInTry = (priceInUsd * TL_EXCHANGE_RATE).toFixed(2);
      return `₺${priceInTry}`;
    }
    return `$${priceInUsd.toFixed(2)}`;
  };

const cartItemCount = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const lowerCaseQuery = searchQuery.toLowerCase();
    return products.filter(product =>
      t(`product_${product.id}_title`).toLowerCase().includes(lowerCaseQuery) ||
      t(product.category).toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, products, t]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery('');
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const handlePurchase = () => {
    if (cartItems.length === 0) return;
    alert(t('orderCreated'));
    dispatch(clearCart());
    dispatch(toggleCart());
  };

  const handleResultClick = (product) => {
    dispatch(setSelectedProduct(product));
    setSearchQuery('');
  };

  return (
    <header className="Header">
      <div className="Header-content">
        <div className="Header-left">
          <div className="HeaderImage"></div>
        </div>
        <div className="Header-center">
          <div className="SearchBar-container" ref={searchRef}>
            <div className="SearchBar">
              <input type="text" placeholder={t('searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="submit" aria-label={t('search')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
            {searchQuery.length > 1 && (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map(product => (
                    <div key={product.id} className="search-result-item" onClick={() => handleResultClick(product)}>
                      <img src={product.image} alt={t(`product_${product.id}_title`)} className="search-result-image" />
                      <span className="search-result-title">{t(`product_${product.id}_title`)}</span>
                    </div>
                  ))
                ) : (<div className="no-results">{t('noResults')}</div>)}
              </div>
            )}
          </div>
        </div>
        <div className="Header-right">
          <nav className="Header-nav">
            <div className="lang-dropdown-container" ref={langDropdownRef}>
              <button className="nav-button lang-dropdown-button" onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}>
                <span className="lang-icon">🌐</span>
                {i18n.language.toUpperCase()}
                <span className={`arrow ${isLangDropdownOpen ? 'up' : 'down'}`}></span>
              </button>
              {isLangDropdownOpen && (
                <div className="lang-dropdown-menu">
                  <button onClick={() => handleLanguageChange('tr')}>{t('turkish')}</button>
                  <button onClick={() => handleLanguageChange('en')}>{t('english')}</button>
                  <button onClick={() => handleLanguageChange('zh')}>{t('chinese')}</button>
                </div>
              )}
            </div>
            <button className="nav-button cart-button" onClick={handleCartClick}>
              {t('cart')} 🛒
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </button>
          </nav>
          <button className="Menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={t('toggleMenu')} aria-expanded={isMenuOpen}>
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line"></div>
          </button>
        </div>
      </div>
      <div className={`Sidebar ${isMenuOpen ? 'open' : ''}`} >
        <button className="close-button" onClick={() => setIsMenuOpen(false)} aria-label={t('closeMenu')}>×</button>
        <ul className="Sidebar-nav">
          <li><a>{t('option1')}</a></li>
          <li><a>{t('option2')}</a></li>
          <li><a>{t('option3')}</a></li>
        </ul>
      </div>
      {(isMenuOpen || isCartOpen) && <div className="overlay" onClick={() => { setIsMenuOpen(false); if (isCartOpen) dispatch(toggleCart()); }}></div>}
      {isCartOpen && (
        <div className="ModalOverlay" onClick={handleCartClick}>
          <div className="ModalContent cart-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={handleCartClick}>×</button>
            <h2 className="modal-title">{t('yourCart')}</h2>
            {cartItems.length === 0 ? (
              <p className="cart-empty-message">{t('cartEmpty')}</p>
            ) : (
              <>
                <div className="cart-items-container">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={t(`product_${item.id}_title`)} className="cart-item-image" />
                      <div className="cart-item-details">
                        <p className="cart-item-title">{t(`product_${item.id}_title`)}</p>
                        <div className="quantity-controls">
                          <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                        </div>
                        {/* Fiyat formatlama fonksiyonu kullanılıyor */}
                        <p className="cart-item-price">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                      <button className="cart-item-remove" onClick={() => dispatch(removeFromCart(item.id))}>×</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  {/* Fiyat formatlama fonksiyonu kullanılıyor */}
                  <h3 className="total-price">{t('total')}: {formatPrice(totalPrice)}</h3>
                  <button className="purchase-button" onClick={handlePurchase}>{t('purchase')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;