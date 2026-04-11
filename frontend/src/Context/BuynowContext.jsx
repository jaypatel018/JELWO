import {useState,  createContext, useContext} from 'react';

const BuynowContext = createContext();

export const BuynowProvider = ({children}) =>{
    const [selectedBuy, setSelectedBuy] = useState([]);
    
  const addBuyNow = (items) => {
    // Accept either a single product object or an array
    setSelectedBuy(Array.isArray(items) ? items : [items]);
  };

  // Increase quantity - syncs with cart
  const increaseBuyQty = (id) => {
    setSelectedBuy(
      selectedBuy.map((item) =>
        item._id === id ? { ...item, qty: (item.qty || 1) + 1 } : item
      )
    );
  };

  // Decrease quantity (but not below 1) - syncs with cart
  const decreaseBuyQty = (id) => {
    setSelectedBuy(
      selectedBuy.map((item) =>
        item._id === id && (item.qty || 1) > 1
          ? { ...item, qty: (item.qty || 1) - 1 }
          : item
      )
    );
  };

  // Remove item - syncs with cart
  const removeFromBuyNow = (id) => {
    setSelectedBuy(selectedBuy.filter((item) => item._id !== id));
  };

  const clearBuyNowItems = () => setSelectedBuy([]);
  
  return(
    <BuynowContext.Provider value={{ 
      selectedBuy, 
      setSelectedBuy,
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