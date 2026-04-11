import axios from 'axios';

const track = (key) => {
  axios.post(`${import.meta.env.VITE_API_URL}/stats/track`, { key }).catch(() => {});
};

export const trackSearch      = () => track('searches');
export const trackProductClick = () => track('productClicks');
export const trackAddToCart   = () => track('addToCart');
