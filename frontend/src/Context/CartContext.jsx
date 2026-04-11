import { useState, createContext, useContext, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const prevEmailRef = useRef(null);

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Load cart from backend on sign-in
  useEffect(() => {
    if (isSignedIn && userEmail && userEmail !== prevEmailRef.current) {
      prevEmailRef.current = userEmail;
      axios.get(`${import.meta.env.VITE_API_URL}/users/cart/${userEmail}`)
        .then(async res => {
          const savedCart = res.data.cart || [];
          if (savedCart.length === 0) return;
          // Fetch full product details
          const productsRes = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
          const allProducts = productsRes.data?.products || productsRes.data || [];
          const restored = savedCart
            .map(({ productId, qty }) => {
              const product = allProducts.find(p => p._id === productId);
              return product ? { ...product, qty } : null;
            })
            .filter(Boolean);
          setCart(restored);
        })
        .catch(() => {});
    }

    // Clear cart on sign-out
    if (!isSignedIn) {
      prevEmailRef.current = null;
      setCart([]);
    }
  }, [isSignedIn, userEmail]);

  // Persist cart to backend on every change (only when signed in)
  useEffect(() => {
    if (!isSignedIn || !userEmail) return;
    const payload = cart.map(item => ({ productId: item._id, qty: item.qty || 1 }));
    axios.post(`${import.meta.env.VITE_API_URL}/users/cart/${userEmail}`, { cart: payload })
      .catch(() => {});
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, qty: (item.qty || 1) + (product.qty || 1) }
            : item
        );
      }
      return [...prev, { ...product, qty: product.qty || 1 }];
    });
    return true;
  };

  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item => item._id === id ? { ...item, qty: (item.qty || 1) + 1 } : item)
    );
  };

  const decreaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id && (item.qty || 1) > 1
          ? { ...item, qty: (item.qty || 1) - 1 }
          : item
      )
    );
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item._id !== id));
  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
  const getCartCount = () => cart.reduce((count, item) => count + (item.qty || 1), 0);
  const totalQty = getCartCount();
  const showCart = isCartOpen;

  return (
    <CartContext.Provider value={{
      cart, isCartOpen, showCart, openCart, closeCart,
      addToCart, increaseQty, decreaseQty, removeFromCart,
      clearCart, getCartTotal, getCartCount, totalQty
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
