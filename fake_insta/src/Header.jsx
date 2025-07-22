import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const menuRef = useRef(null); 
  const searchRef = useRef(null);

  
  const dispatch = useDispatch();
  
  
  const { cartItems, isCartOpen } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.catalog); 

 
  
  
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) { 
      return [];
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return products.filter(product => 
      product.title.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, products]);

 

  useEffect(() => {
    const handleClickOutside = (event) => {
      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery(''); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  

 
  const handleCartClick = () => {
    dispatch(toggleCart());
  };
  
  
  const handlePurchase = () => {
    if (cartItems.length === 0) return; 
    alert('Siparişiniz Oluşturuldu!');
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
              <input 
                type="text" 
                placeholder="Ürün veya kategori ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Ara">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
            
            
            {searchQuery.length > 1 && (
                 <div className="search-results">
                    {searchResults.length > 0 ? (
                        searchResults.map(product => (
                          <div 
                            key={product.id} 
                            className="search-result-item"
                            onClick={() => handleResultClick(product)}
                          >
                            <img src={product.image} alt={product.title} className="search-result-image" />
                            <span className="search-result-title">{product.title}</span>
                          </div>
                        ))
                    ) : (
                        <div className="no-results">Sonuç bulunamadı.</div>
                    )}
                 </div>
            )}
          </div>
        </div>

        <div className="Header-right" ref={menuRef}>
          <nav className="Header-nav">
            <button className="nav-button cart-button" onClick={handleCartClick}>
              Sepet 🛒
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </button>
          </nav>
          <button
            className="Menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menüyü aç/kapat"
            aria-expanded={isMenuOpen}
          >
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line"></div>
            <div className="menu-icon-line"></div>
          </button>
        </div>
      </div>

       
       <div className={`Sidebar ${isMenuOpen ? 'open' : ''}`} >
            <button
                className="close-button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Menüyü kapat"
            >×</button>
            <ul className="Sidebar-nav">
                <li><a>Seçenek 1</a></li>
                <li><a>Seçenek 2</a></li>
                <li><a>Seçenek 3</a></li>
            </ul>
        </div>
        
        
        {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}

        
        {isCartOpen && (
            <div className="ModalOverlay" onClick={handleCartClick}>
                <div className="ModalContent cart-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close-button" onClick={handleCartClick}>×</button>
                    <h2 className="modal-title">Sepetiniz</h2>
                    
                    {cartItems.length === 0 ? (
                        <p className="cart-empty-message">Sepetinizde ürün bulunmuyor.</p>
                    ) : (
                        <>
                            <div className="cart-items-container">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <img src={item.image} alt={item.title} className="cart-item-image" />
                                        <div className="cart-item-details">
                                            <p className="cart-item-title">{item.title}</p>
                                            <div className="quantity-controls">
                                                <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                                            </div>
                                            <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <button className="cart-item-remove" onClick={() => dispatch(removeFromCart(item.id))}>×</button>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary">
                                <h3 className="total-price">Toplam: ${totalPrice.toFixed(2)}</h3>
                                <button className="purchase-button" onClick={handlePurchase}>Satın Al</button>
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