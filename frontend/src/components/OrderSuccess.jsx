import { useEffect } from 'react';
import './OrderSuccess.css';

const OrderSuccess = ({ orderNumber, onClose }) => {
  useEffect(() => {
    // Auto close after 4 seconds
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="os-overlay">
      <div className="os-card">
        {/* Animated checkmark */}
        <div className="os-circle">
          <svg className="os-checkmark" viewBox="0 0 52 52">
            <circle className="os-circle-bg" cx="26" cy="26" r="25" fill="none" />
            <path className="os-check" fill="none" d="M14 27 l8 8 l16-16" />
          </svg>
        </div>

        <h2 className="os-title">Order Placed!</h2>
        <p className="os-order-num">#{orderNumber}</p>
        <p className="os-msg">Thank you for your purchase.<br/>We'll send a confirmation to your email.</p>

        <button className="os-btn" onClick={onClose}>View Orders</button>
      </div>
    </div>
  );
};

export default OrderSuccess;
