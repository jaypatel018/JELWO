import './OrderCancelled.css';

const OrderCancelled = ({ onClose, onRetry }) => {
  return (
    <div className="oc-overlay">
      <div className="oc-card">
        {/* X icon */}
        <div className="oc-circle">
          <svg className="oc-cross" viewBox="0 0 52 52">
            <circle className="oc-circle-bg" cx="26" cy="26" r="25" fill="none" />
            <path className="oc-x" fill="none" d="M16 16 l20 20 M36 16 l-20 20" />
          </svg>
        </div>

        <h2 className="oc-title">Order Cancelled</h2>
        <p className="oc-msg">Your payment was not completed.<br />No amount has been deducted.</p>

        <div className="oc-actions">
          <button className="oc-retry-btn" onClick={onRetry}>Try Again</button>
          <button className="oc-close-btn" onClick={onClose}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelled;
