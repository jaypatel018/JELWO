import React, { createContext, useState, useEffect, useRef } from "react";
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const prevEmailRef = useRef(null);

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Load wishlist from backend when user signs in
  useEffect(() => {
    if (isSignedIn && userEmail && userEmail !== prevEmailRef.current) {
      prevEmailRef.current = userEmail;
      axios.get(`${import.meta.env.VITE_API_URL}/users/wishlist/${userEmail}`)
        .then(res => {
          const ids = res.data.wishlist || [];
          if (ids.length === 0) return;
          // Fetch full product details for each saved product ID
          return axios.get(`${import.meta.env.VITE_API_URL}/products`)
            .then(prodRes => {
              const allProducts = prodRes.data?.products || prodRes.data || [];
              const saved = allProducts.filter(p => ids.includes(p._id));
              setWishlist(saved);
            });
        })
        .catch(() => {});
    }

    // Clear wishlist when user signs out
    if (!isSignedIn) {
      prevEmailRef.current = null;
      setWishlist([]);
    }
  }, [isSignedIn, userEmail]);

  // Persist wishlist to backend whenever it changes (only when signed in)
  useEffect(() => {
    if (!isSignedIn || !userEmail) return;
    const ids = wishlist.map(item => item._id);
    axios.post(`${import.meta.env.VITE_API_URL}/users/wishlist/${userEmail}`, { wishlist: ids })
      .catch(() => {});
  }, [wishlist]);

  const toggleWishlist = (product, navigate) => {
    if (!isSignedIn) {
      alert("Please sign in to add items to wishlist");
      if (navigate) navigate('/sign-in');
      return false;
    }
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      return exists ? prev.filter(item => item._id !== product._id) : [...prev, product];
    });
    return true;
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
