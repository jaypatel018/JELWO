import {useState,  createContext, useContext} from 'react';

const BuynowContext = createContext();

const SESSION_KEY = 'buynow_items';

export const BuynowProvider = ({children}) =>{
    const [selectedBuy, setSelectedBuy] = useState(() => {
      try {
        const saved = sessionStorage.getItem(SESSION_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    });

    const persist = (items) => {
      setSelectedBuy(items);
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(items)); } catch {}
    };

  const addBuyNow = (items) => {
    // Accept either a single product object or an array
    persist(Array.isArray(items) ? items : [items]);
  };

  // Increase quantity - syncs with cart
  const increaseBuyQty = (id) => {
    persist(
      selectedBuy.map((item) =>
        item._id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
      )
    );
  };

  // Decrease quantity (but not below 1) - syncs with cart
  const decreaseBuyQty = (id) => {
    persist(
      selectedBuy.map((item) =>
        item._id === id && (item.qty || 1) > 1
          ? { ...item, qty: (item.qty || 1) - 1 }
          : item
      )
    );
  };

  // Remove item - syncs with cart
  const removeFromBuyNow = (id) => {
    persist(selectedBuy.filter((item) => item._id !== id));
  };

  const clearBuyNowItems = () => {
    setSelectedBuy([]);
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  };
  
  return(
    <BuynowContext.Provider value={{ 
      selectedBuy, 
      setSelectedBuy: persist,
      addBuyNow, 
      increaseBuyQty,
      decreaseBuyQty,
      removeFromBuyNow,
      clearBuyNowItems
    }}>
        {children}
    </BuynowContext.Provider>
    )
}
export const useBuynow = () => useContext(BuynowContext);