import React, { useState, useEffect, useRef } from 'react'
import './Buynow.css'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useBuynow } from '../Context/BuynowContext';
import { useCart } from '../Context/CartContext';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrderSuccess from '../components/OrderSuccess';
const Buynow = () => {
    const {selectedBuy, clearBuyNowItems, increaseBuyQty, decreaseBuyQty, removeFromBuyNow} = useBuynow();
    const {increaseQty, decreaseQty, removeFromCart} = useCart();
    const buyItems = Array.isArray(selectedBuy) ? selectedBuy : [];
    const { user } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    
    // Calculate subtotal
    const subtotal = buyItems.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
    
    // Calculate shipping charge - Rs. 40 if subtotal < 500, otherwise free
    const shippingCharge = subtotal >= 500 ? 0 : 40;
    
    // Sync increase quantity with cart
    const handleIncreaseQty = (id) => {
      increaseBuyQty(id);
      increaseQty(id);
    };
    
    // Sync decrease quantity with cart
    const handleDecreaseQty = (id) => {
      decreaseBuyQty(id);
      decreaseQty(id);
    };
    
    // Sync remove item with cart
    const handleRemoveItem = (id) => {
      removeFromBuyNow(id);
      removeFromCart(id);
    };
    
    //state for collapse
     const [open, setOpen] = useState(false);
    // state for radio input
    const [selected, setSelected] = useState("ship");
    // state for select country
      const [country, setCountry] = useState("India");
      const handleChange = (e)=>{
        setCountry(e.target.value)
      }
      // state for state
       const [state, setState] = useState("Gujrat");
      const handleChange1 = (e)=>{
        setState(e.target.value)
      }
      
      // Form states
      const [formData, setFormData] = useState({
        email: user?.primaryEmailAddress?.emailAddress || '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        district: '',
        pinCode: '',
      });
      
      const [loading, setLoading] = useState(false);
      const [paymentMethod, setPaymentMethod] = useState('razorpay');
      const [successOrder, setSuccessOrder] = useState(null);
      const [fieldErrors, setFieldErrors] = useState({});
      const [mobileStep, setMobileStep] = useState(1); // 1 = summary, 2 = checkout
      const [pinStatus, setPinStatus] = useState(null); // null | 'validating' | 'valid' | 'invalid' | 'mismatch'
      const [pinMessage, setPinMessage] = useState('');
      const [pinApiData, setPinApiData] = useState(null); // { district, state }

      const validatePincode = async (pin) => {
        if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
          setPinStatus('invalid');
          setPinMessage('PIN code must be 6 digits');
          return;
        }
        setPinStatus('validating');
        setPinMessage('Validating...');
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await res.json();
          if (data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
            const offices = data[0].PostOffice;
            const apiDistrict = offices[0].District;
            const apiState = offices[0].State;
            // Auto-fill district and state from API
            setFormData(p => ({ ...p, district: apiDistrict }));
            setState(apiState);
            setPinApiData({ district: apiDistrict, state: apiState });
            setPinStatus('valid');
            setPinMessage(`✓ Valid — ${apiDistrict}, ${apiState}`);
          } else {
            setPinStatus('invalid');
            setPinMessage('Invalid PIN code — not found');
            setFormData(p => ({ ...p, district: '' }));
            setPinApiData(null);
          }
        } catch {
          setPinStatus(null);
          setPinMessage('');
        }
      };

      // Re-validate when user manually edits district or state after pincode was set
      const checkDistrictStateMatch = (districtVal, stateVal) => {
        if (!pinApiData) return;
        const apiDistrict = pinApiData.district.toLowerCase();
        const apiState = pinApiData.state.toLowerCase();
        const d = districtVal.toLowerCase().trim();
        const s = stateVal.toLowerCase().trim();
        if (d !== apiDistrict || s !== apiState) {
          setPinStatus('mismatch');
          setPinMessage(`PIN ${formData.pinCode} belongs to ${pinApiData.district}, ${pinApiData.state}`);
        } else {
          setPinStatus('valid');
          setPinMessage(`✓ Valid — ${pinApiData.district}, ${pinApiData.state}`);
        }
      };

      // Coupon states
      const [coupons, setCoupons] = useState([]);
      const [showCoupons, setShowCoupons] = useState(false);
      const [couponInput, setCouponInput] = useState('');
      const [appliedCoupon, setAppliedCoupon] = useState(null);
      const [couponError, setCouponError] = useState('');
      const [couponDiscount, setCouponDiscount] = useState(0);

      // Fetch active coupons
      useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/coupons/active`)
          .then(res => setCoupons(res.data.coupons || []))
          .catch(() => {});
      }, []);

      // Auto-apply FIRST10 coupon for new users (no previous orders)
      useEffect(() => {
        if (!user) return;
        axios.get(`${import.meta.env.VITE_API_URL}/orders/user/${user.id}`)
          .then(res => {
            const userOrders = res.data.orders || [];
            if (userOrders.length === 0) {
              // New user — auto-apply FIRST10
              axios.post(`${import.meta.env.VITE_API_URL}/coupons/validate`, {
                code: 'FIRST10',
                orderTotal: subtotal || 1
              }).then(r => {
                if (r.data.success) {
                  setAppliedCoupon(r.data.coupon);
                  setCouponDiscount(Math.round((subtotal * 10) / 100));
                  setCouponInput('FIRST10');
                }
              }).catch(() => {});
            }
          })
          .catch(() => {});
      }, [user]); // only run when user loads

      // Re-validate coupon whenever subtotal changes
      useEffect(() => {
        if (!appliedCoupon) return;

        // If subtotal drops below minOrder, auto-remove coupon
        if (subtotal < (appliedCoupon.minOrder || 0)) {
          setAppliedCoupon(null);
          setCouponDiscount(0);
          setCouponInput('');
          setCouponError('');
          return;
        }

        // Recalculate discount for percentage coupons
        if (appliedCoupon.discountType === 'percentage') {
          const raw = Math.round((subtotal * appliedCoupon.discountValue) / 100);
          const capped = appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
          setCouponDiscount(capped);
        }
      }, [subtotal]);

      const applyCoupon = async (code) => {
        const c = code || couponInput;
        if (!c.trim()) return;
        setCouponError('');
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/coupons/validate`, {
            code: c.trim().toUpperCase(),
            orderTotal: subtotal,
            clerkUserId: user?.id
          });
          if (res.data.success) {
            setAppliedCoupon(res.data.coupon);
            setCouponDiscount(res.data.discount);
            setCouponInput(res.data.coupon.code);
            setShowCoupons(false);
          }
        } catch (err) {
          setCouponError(err.response?.data?.message || 'Invalid coupon');
          setAppliedCoupon(null);
          setCouponDiscount(0);
        }
      };

      const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponInput('');
        setCouponError('');
      };

      // Final total after coupon
      const finalTotal = subtotal + shippingCharge - couponDiscount;
      
      // Auto-fill form from user profile
      useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
          axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${user.primaryEmailAddress.emailAddress}`)
            .then(res => {
              const p = res.data;
              const addr = p.address || {};
              setFormData(prev => ({
                ...prev,
                email: p.email || prev.email,
                firstName: p.firstName || prev.firstName,
                lastName: p.lastName || prev.lastName,
                phone: p.contactNumber || p.phone || prev.phone,
                address: addr.street || prev.address,
                apartment: addr.addressLine2 || prev.apartment,
                city: addr.city || prev.city,
                district: addr.district || prev.district,
                pinCode: addr.zipCode || prev.pinCode,
              }));
              if (addr.state) setState(addr.state);
              if (addr.country) setCountry(addr.country);
              // If pinCode exists, validate it to show status
              if (addr.zipCode && addr.zipCode.length === 6) {
                setPinStatus('valid');
                setPinMessage(`✓ Valid — ${addr.district || ''}, ${addr.state || ''}`);
                setPinApiData({ district: addr.district || '', state: addr.state || '' });
              }
            })
            .catch(() => {}); // silently fail if no profile
        }
      }, [user]);
      
      // Handle form input changes
      const handleInputChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
      
      // Handle payment submission
      const handlePayment = async (e) => {
        e.preventDefault();
        
        if (!user) {
          alert('Please sign in to complete your order');
          navigate('/sign-in');
          return;
        }
        
        if (buyItems.length === 0) {
          alert('Your cart is empty');
          return;
        }

        if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.pinCode || pinStatus === 'invalid' || pinStatus === 'mismatch') {
          const errors = {};
          if (!formData.firstName) errors.firstName = true;
          if (!formData.lastName)  errors.lastName  = true;
          if (!formData.address)   errors.address   = true;
          if (!formData.city)      errors.city      = true;
          if (!formData.pinCode || pinStatus === 'invalid' || pinStatus === 'mismatch') errors.pinCode = true;
          setFieldErrors(errors);
          const firstError = Object.keys(errors)[0];
          document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        setFieldErrors({});

        setLoading(true);

        // Cash on Delivery
        if (paymentMethod === 'cod') {
          try {
            const orderData = {
              customerInfo: {
                email: formData.email || user.primaryEmailAddress?.emailAddress,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
              },
              products: buyItems.map(item => ({
                productId: item._id,
                title: item.title,
                price: item.price,
                quantity: item.qty || 1,
                frontImg: item.frontImg,
              })),
              shippingAddress: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                apartment: formData.apartment,
                city: formData.city,
                district: formData.district,
                state: state,
                pinCode: formData.pinCode,
                country: country,
              },
              shippingMethod: selected,
              paymentInfo: { method: 'cod', status: 'pending' },
              subtotal,
              shippingCost: shippingCharge,
              tax: 0,
              total: finalTotal,
              status: 'pending',
              couponCode: appliedCoupon?.code || null,
            };
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/payment/cod`, {
              clerkUserId: user.id,
              orderData,
            });
            if (res.data.success) {
              setSuccessOrder(res.data.order.orderNumber);
              clearBuyNowItems();
            }
          } catch (err) {
            alert(`Error: ${err.response?.data?.message || err.message}`);
          } finally {
            setLoading(false);
          }
          return;
        }
        
        try {
          // Step 1: Create Razorpay order on backend
          const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
            amount: finalTotal,
          });

          if (!data.success) throw new Error('Failed to create payment order');

          // Step 2: Open Razorpay checkout popup
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: 'Jelwo',
            description: 'Jewellery Purchase',
            order_id: data.orderId,
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email || user.primaryEmailAddress?.emailAddress,
              contact: formData.phone,
            },
            theme: { color: '#8B6914' },
            handler: async (response) => {
              try {
                // Step 3: Verify payment and save order
                const orderData = {
                  customerInfo: {
                    email: formData.email || user.primaryEmailAddress?.emailAddress,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                  },
                  products: buyItems.map(item => ({
                    productId: item._id,
                    title: item.title,
                    price: item.price,
                    quantity: item.qty || 1,
                    frontImg: item.frontImg,
                  })),
                  shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    apartment: formData.apartment,
                    city: formData.city,
                    district: formData.district,
                    state: state,
                    pinCode: formData.pinCode,
                    country: country,
                  },
                  shippingMethod: selected,
                  subtotal,
                  shippingCost: shippingCharge,
                  tax: 0,
                  total: finalTotal,
                  couponCode: appliedCoupon?.code || null,
                };

                const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/payment/verify`, {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  clerkUserId: user.id,
                  orderData,
                });

                if (verifyRes.data.success) {
                  setSuccessOrder(verifyRes.data.order.orderNumber);
                  clearBuyNowItems();
                } else {
                  alert('Payment succeeded but order save failed. Contact support.');
                }
              } catch (err) {
                console.error('Order save error:', err);
                alert(`Payment done but order save failed: ${err.response?.data?.message || err.message}`);
              } finally {
                setLoading(false);
              }
            },
            modal: {
              ondismiss: () => setLoading(false),
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', (response) => {
            alert(`Payment failed: ${response.error.description}`);
            setLoading(false);
          });
          rzp.open();

        } catch (error) {
          console.error('Payment error:', error);
          alert(`Error: ${error.response?.data?.message || error.message}`);
          setLoading(false);
        }
      };
  return (
    <div className=' p-0 p-md-4'>
      {successOrder && (
        <OrderSuccess
          orderNumber={successOrder}
          onClose={() => { setSuccessOrder(null); navigate('/profile'); }}
        />
      )}
       <div className='border-bottom pt-2 pb-2 ps-3 ps-md-5 d-flex align-items-center gap-3'>
        {mobileStep === 2 && (
          <button className='bn-back-btn d-md-none' onClick={() => setMobileStep(1)}>
            <i className='fa-solid fa-arrow-left'></i>
          </button>
        )}
        <h3 className='mb-0'>Jelwo</h3>

        {/* Mobile step progress */}
        <div className='bn-steps d-md-none ms-auto me-3'>
          <div className={`bn-step ${mobileStep >= 1 ? 'bn-step-active' : ''}`}>
            <span className='bn-step-circle'>1</span>
            <span className='bn-step-label'>Summary</span>
          </div>
          <div className='bn-step-line'></div>
          <div className={`bn-step ${mobileStep >= 2 ? 'bn-step-active' : ''}`}>
            <span className='bn-step-circle'>2</span>
            <span className='bn-step-label'>Checkout</span>
          </div>
        </div>
       </div>
       <div className="row g-0">
           <div className={`col-12 col-md-6 border-end border-grey p-3 p-md-5 pb-0 order-2 order-md-1 ${mobileStep === 1 ? 'd-none d-md-block' : ''}`}>
            <div className='contact-detail mb-3'>
                <div className='d-flex justify-content-between align-items-center'>
                    <h5>Contact</h5>
                    {!user && <a href="/sign-in" className='text-primary'>Sign in</a>}
                </div>
                {user ? (
                  <div className='bn-user-row mt-2 mb-2'>
                    <div className='bn-user-info'>
                      <div className='bn-user-avatar'>{user.firstName?.[0] || user.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase()}</div>
                      <span className='bn-user-email'>{user.primaryEmailAddress?.emailAddress}</span>
                    </div>
                    <div className='bn-user-menu-wrap'>
                      <button className='bn-dots-btn'><i className='fa-solid fa-ellipsis-vertical'></i></button>
                      <div className='bn-user-dropdown'>
                        <button onClick={() => signOut(() => navigate('/sign-in'))} className='bn-signout-btn'>
                          <i className='fa-solid fa-right-from-bracket me-2'></i>Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='mt-2 mb-2 contact1'>
                    <input
                      type="email"
                      name="email"
                      placeholder='Email or mobile phone number'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                <label>
                    <input type="checkbox"/>
                    Email me with news and offers
                </label>
            </div>
            <div className="delivery-section mt-3 mb-3">
                <h5 className="fw-bold mb-3">Delivery</h5>
                <div className="form mt-2 mb-2">
                  <form onSubmit={handlePayment}>
                    {/* Country/Region */}
                    <div className="bn-field-wrap mb-3">
                      <label className="bn-field-label">Country/Region</label>
                      <select value={country} onChange={handleChange} className="bn-select">
                        <option value="India">India</option>
                        <option value="Algeria">Algeria</option>
                        <option value="China">China</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>

                    {/* First + Last name */}
                    <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
                      <input type="text" name="firstName" placeholder="First name" className={`bn-input w-100 ${fieldErrors.firstName ? 'bn-field-error' : ''}`} value={formData.firstName} onChange={e => { handleInputChange(e); setFieldErrors(p => ({...p, firstName: false})); }} required />
                      <input type="text" name="lastName" placeholder="Last name" className={`bn-input w-100 ${fieldErrors.lastName ? 'bn-field-error' : ''}`} value={formData.lastName} onChange={e => { handleInputChange(e); setFieldErrors(p => ({...p, lastName: false})); }} required />
                    </div>

                    {/* Address */}
                    <div className="bn-input-icon mb-3">
                      <input type="text" name="address" placeholder="Address" className={`bn-input w-100 ${fieldErrors.address ? 'bn-field-error' : ''}`} value={formData.address} onChange={e => { handleInputChange(e); setFieldErrors(p => ({...p, address: false})); }} required />
                      <i className="fa-solid fa-magnifying-glass bn-input-icon-right"></i>
                    </div>

                    {/* Apartment */}
                    <div className="mb-3">
                      <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" className="bn-input w-100" value={formData.apartment} onChange={handleInputChange} />
                    </div>

                    {/* City + District */}
                    <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
                      <input
                        type="text"
                        name="city"
                        placeholder="City / Town"
                        className={`bn-input w-100 ${fieldErrors.city ? 'bn-field-error' : ''}`}
                        value={formData.city}
                        onChange={e => { handleInputChange(e); setFieldErrors(p => ({...p, city: false})); }}
                        required
                      />
                      <input
                        type="text"
                        name="district"
                        placeholder="District"
                        className={`bn-input w-100 ${pinStatus === 'mismatch' ? 'bn-field-error' : pinStatus === 'valid' ? 'bn-field-success' : ''}`}
                        value={formData.district}
                        onChange={e => {
                          handleInputChange(e);
                          checkDistrictStateMatch(e.target.value, state);
                        }}
                      />
                    </div>

                    {/* State + PIN */}
                    <div className="d-flex flex-column flex-sm-row gap-3 mb-1">
                      <div className="bn-field-wrap w-100">
                        <label className="bn-field-label">State</label>
                        <select value={state} onChange={e => { handleChange1(e); checkDistrictStateMatch(formData.district, e.target.value); }} className={`bn-select ${pinStatus === 'mismatch' ? 'bn-field-error' : pinStatus === 'valid' ? 'bn-field-success' : ''}`} required>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Andaman and Nicobar Island">Andaman and Nicobar Island</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Goa">Goa</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                        </select>
                      </div>
                      <div className="w-100">
                        <input
                          type="text"
                          name="pinCode"
                          placeholder="PIN code"
                          maxLength={6}
                          className={`bn-input w-100 ${fieldErrors.pinCode || pinStatus === 'invalid' || pinStatus === 'mismatch' ? 'bn-field-error' : pinStatus === 'valid' ? 'bn-field-success' : ''}`}
                          value={formData.pinCode}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setFormData(p => ({ ...p, pinCode: val }));
                            setFieldErrors(p => ({...p, pinCode: false}));
                            if (val.length === 6) validatePincode(val);
                            else { setPinStatus(null); setPinMessage(''); setFormData(p => ({...p, district: ''})); setPinApiData(null); }
                          }}
                          required
                        />
                        {pinMessage && (
                          <p className={`bn-pin-msg ${pinStatus === 'valid' ? 'bn-pin-valid' : 'bn-pin-error'}`}>
                            {pinStatus === 'validating' && <span className="spinner-border spinner-border-sm me-1" style={{width:'10px',height:'10px'}}></span>}
                            {pinMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mb-3"></div>

                    {/* Phone with India flag */}
                    <div className="bn-phone-wrap mb-3">
                      <div className="bn-phone-input-wrap">
                        <label className="bn-field-label">Phone</label>
                        <input type="tel" name="phone" placeholder="Phone" className="bn-phone-input" value={formData.phone} onChange={handleInputChange} />
                        <i className="fa-regular fa-circle-question bn-phone-help"></i>
                      </div>
                      <div className="bn-flag-wrap">
                        <img src="/img/india.png" alt="IN" className="bn-flag-img" />
                        <i className="fa-solid fa-chevron-down" style={{fontSize:'11px'}}></i>
                      </div>
                    </div>

                    <label className="d-flex align-items-center gap-2 mb-3" style={{fontSize:'14px'}}>
                      <input type="checkbox" />
                      Save this information for next time
                    </label>
                  </form>
                </div>
            </div>
            <div className='mt-4'>
                <h5 className="fw-bold">Payment</h5>
                <p style={{fontSize:'14px', color:'#6b7280', marginBottom:'16px'}}>All transactions are secure and encrypted.</p>

                <div className="bn-payment-options">
                  {/* Razorpay */}
                  <div
                    className={`bn-payment-option ${paymentMethod === 'razorpay' ? 'bn-payment-option-selected' : ''}`}
                    onClick={() => setPaymentMethod('razorpay')}
                    style={{cursor:'pointer'}}
                  >
                    <div className="bn-payment-option-left">
                      <span className={`bn-radio-circle ${paymentMethod === 'razorpay' ? 'bn-radio-selected' : ''}`}></span>
                      <span className="bn-payment-label">Pay with UPI, Cards, Net Banking, Wallets &amp; more</span>
                    </div>
                    <div className="bn-payment-logos">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="bn-pay-logo" />
                      <img src="/img/visa.png" alt="Visa" className="bn-pay-logo" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="MC" className="bn-pay-logo" />
                      <img src="/img/rupay.webp" alt="RuPay" className="bn-pay-logo" />
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    className={`bn-payment-option ${paymentMethod === 'cod' ? 'bn-payment-option-selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                    style={{cursor:'pointer'}}
                  >
                    <div className="bn-payment-option-left">
                      <span className={`bn-radio-circle ${paymentMethod === 'cod' ? 'bn-radio-selected' : ''}`}></span>
                      <span className="bn-payment-label">Cash on Delivery</span>
                    </div>
                    <div className="bn-payment-logos">
                      <i className="fa-solid fa-money-bill-wave" style={{fontSize:'20px', color:'#16a34a'}}></i>
                    </div>
                  </div>

                  <div className="bn-payment-powered">
                    <i className="fa-solid fa-lock" style={{fontSize:'11px',color:'#9ca3af'}}></i>
                    <span>Powered by <strong>Razorpay</strong> — Secure &amp; Encrypted</span>
                  </div>
                </div>

                <div className='mt-3 mb-3'>
                  <button type="button" onClick={handlePayment} className='pay' disabled={loading}>
                    {loading ? 'Processing...' : paymentMethod === 'cod' ? `Place Order (COD) Rs. ${finalTotal.toFixed(2)}` : `Pay Rs. ${finalTotal.toFixed(2)}`}
                  </button>
                </div>

                <div className='mt-2'>
                  <a href="" className='text-primary' style={{fontSize:'13px'}}>Privacy policy</a>
                </div>
            </div>
           </div>
           <div className={`col-12 col-md-6 total-card order-1 order-md-2 ${mobileStep === 2 ? 'd-none d-md-block' : ''}`}>
               <div className='total-section p-2 p-md-5 '>
                 <h5 className="order-summary-title">
                   <i className="fa-solid fa-receipt me-2"></i>
                   Order Summary
                 </h5>
                 
                 <div className="buynow-products-container">
                    {buyItems.length === 0 ? (
                      <div className="empty-buynow">
                        <i className="fa-solid fa-shopping-bag empty-icon"></i>
                        <h5>No products added</h5>
                        <p>Add items to your cart to proceed</p>
                      </div>
                    ) : (
                      buyItems.map((item) => (
                        <div key={item._id} className='buynow-product-card'>
                          {/* Image — clickable */}
                          <div className="buynow-product-image" onClick={() => navigate(`/product/${item._id}`)} style={{cursor:'pointer'}}>
                            <img src={`${import.meta.env.VITE_API_IMAGE}/${item.frontImg}`} alt={item.title} />
                          </div>

                          {/* Details */}
                          <div className="buynow-product-details">
                            <h6 className="buynow-product-title">{item.title}</h6>
                            <div className="buynow-product-meta">
                              <span className="meta-item">
                                <i className="fa-solid fa-circle" style={{
                                  fontSize:'8px',
                                  color: item.metalColor === 'Rose Gold' ? '#B76E79'
                                       : item.metalColor === 'White Gold' ? '#C0C0C0'
                                       : '#D4AF37'
                                }}></i> {item.metalColor || 'Gold'}
                              </span>
                            </div>
                            <div className="buynow-item-price-row">
                              <span className="unit-price">Rs. {item.price}</span>
                              {item.qty > 1 && <span className="qty-multiplier">× {item.qty}</span>}
                            </div>
                            {/* Qty controls bottom-left */}
                            <div className="buynow-quantity-controls">
                              <button className="buynow-qty-btn" onClick={() => handleDecreaseQty(item._id)} disabled={item.qty <= 1}>
                                <i className="fa-solid fa-minus"></i>
                              </button>
                              <span className="buynow-qty-display">{item.qty || 1}</span>
                              <button className="buynow-qty-btn" onClick={() => handleIncreaseQty(item._id)}>
                                <i className="fa-solid fa-plus"></i>
                              </button>
                            </div>
                          </div>

                          {/* Right side — price + delete */}
                          <div className="buynow-product-right">
                            <span className="buynow-product-price">Rs. {(item.price * (item.qty || 1)).toFixed(2)}</span>
                            <button className="buynow-remove-btn" onClick={() => handleRemoveItem(item._id)} title="Remove">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                 </div>
                 
                 {buyItems.length > 0 && (
                   <>
                     <button 
                       onClick={clearBuyNowItems} 
                       className='clear-all-btn'
                     >
                       <i className="fa-solid fa-trash-can me-2"></i>
                       Clear All Items
                     </button>

                     {/* ── Coupon Section ── */}
                     <div className="bn-coupon-section">
                       <h6 className="bn-coupon-heading">Apply Discount Code</h6>
                       <div className="bn-coupon-input-row">
                         <input
                           type="text"
                           className="bn-coupon-input"
                           placeholder="Discount Code"
                           value={couponInput}
                           onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                           disabled={!!appliedCoupon}
                         />
                         {appliedCoupon ? (
                           <button className="bn-coupon-remove-btn" onClick={removeCoupon}>Remove</button>
                         ) : (
                           <button className="bn-coupon-apply-btn" onClick={() => applyCoupon()}>Apply</button>
                         )}
                       </div>
                       {couponError && <p className="bn-coupon-error">{couponError}</p>}
                       {appliedCoupon && (
                         <p className="bn-coupon-success">
                           <i className="fa-solid fa-check-circle me-1"></i>
                           "{appliedCoupon.code}" applied — You save Rs. {couponDiscount.toFixed(2)}
                         </p>
                       )}

                       {/* All coupons toggle */}
                       {coupons.length > 0 && (
                         <div>
                           <button className="bn-all-coupons-btn" onClick={() => setShowCoupons(!showCoupons)}>
                             All coupons <i className={`fa-solid fa-chevron-${showCoupons ? 'up' : 'down'} ms-1`} style={{fontSize:'11px'}}></i>
                           </button>
                           {showCoupons && (
                             <div className="bn-coupon-list">
                               {coupons.map(c => (
                                 <div key={c._id} className="bn-coupon-item">
                                   <div>
                                     <p className="bn-coupon-item-code">{c.code}</p>
                                     <p className="bn-coupon-item-desc">
                                       {c.discountType === 'percentage'
                                         ? `Extra ${c.discountValue}% Off`
                                         : `Flat ₹${c.discountValue} Off`}
                                       {c.minOrder > 0 ? ` on orders above ₹${c.minOrder}` : ''}
                                     </p>
                                   </div>
                                   <button
                                     className="bn-coupon-item-apply"
                                     onClick={() => { setCouponInput(c.code); applyCoupon(c.code); }}
                                   >
                                     Apply
                                   </button>
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                     
                     <div className="buynow-summary">

                       {/* Subtotal */}
                       <div className="summary-row">
                         <span className="summary-label">
                           <i className="fa-solid fa-bag-shopping me-2" style={{color:'#9ca3af',fontSize:'13px'}}></i>
                           Subtotal ({buyItems.reduce((t,i) => t + (i.qty||1), 0)} item{buyItems.reduce((t,i) => t + (i.qty||1), 0) !== 1 ? 's' : ''})
                         </span>
                         <span className="summary-value">Rs. {subtotal.toFixed(2)}</span>
                       </div>

                       {/* Shipping */}
                       <div className="summary-row">
                         <span className="summary-label">
                           <i className="fa-solid fa-truck me-2" style={{color:'#9ca3af',fontSize:'13px'}}></i>
                           Delivery Fee
                         </span>
                         <span className="summary-value">
                           {shippingCharge === 0 ? (
                             <span className="free-shipping">
                               Free <del style={{color:'#9ca3af', fontWeight:400, marginLeft:'6px'}}>₹40.00</del>
                             </span>
                           ) : `Rs. ${shippingCharge.toFixed(2)}`}
                         </span>
                       </div>

                       {/* Free shipping nudge */}
                       {subtotal < 500 && subtotal > 0 && (
                         <div className="shipping-promo">
                           <i className="fa-solid fa-truck-fast"></i>
                           Add Rs. {(500 - subtotal).toFixed(2)} more for FREE shipping!
                         </div>
                       )}

                       {/* Coupon Discount */}
                       {couponDiscount > 0 && (
                         <div className="summary-row summary-discount-row">
                           <span className="summary-label">
                             <i className="fa-solid fa-tag me-2" style={{fontSize:'13px'}}></i>
                             Discount
                             <span className="summary-coupon-badge">{appliedCoupon?.code}</span>
                             {appliedCoupon?.discountType === 'percentage' && (
                               <span className="summary-hint"> ({appliedCoupon.discountValue}% off{appliedCoupon.maxDiscount ? `, max ₹${appliedCoupon.maxDiscount}` : ''})</span>
                             )}
                           </span>
                           <span className="summary-value summary-discount-value">− Rs. {couponDiscount.toFixed(2)}</span>
                         </div>
                       )}

                       {/* Tax */}
                       <div className="summary-row">
                         <span className="summary-label">
                           <i className="fa-solid fa-file-invoice me-2" style={{color:'#9ca3af',fontSize:'13px'}}></i>
                           Tax (GST)
                         </span>
                         <span className="summary-value" style={{color:'#6b7280'}}>Included</span>
                       </div>

                       <div className="summary-divider"></div>

                       {/* Total */}
                       <div className="summary-row total-row">
                         <span>
                           Total
                           {couponDiscount > 0 && (
                             <span className="summary-saving-tag">
                               <i className="fa-solid fa-piggy-bank me-1"></i>
                               You save Rs. {couponDiscount.toFixed(2)}
                             </span>
                           )}
                         </span>
                         <span className="total-value">
                           <span className="currency">INR</span>
                           Rs. {finalTotal.toFixed(2)}
                         </span>
                       </div>

                     </div>
                     
                     <div className="secure-checkout-badge">
                       <i className="fa-solid fa-lock"></i>
                       <span>Secure Checkout</span>
                     </div>

                     {/* Mobile Continue button — only on step 1 */}
                     <button
                       className='bn-continue-btn d-md-none'
                       onClick={() => setMobileStep(2)}
                       disabled={buyItems.length === 0}
                     >
                       Continue to Checkout <i className='fa-solid fa-arrow-right ms-2'></i>
                     </button>
                   </>
                 )}
               </div>
           </div>
       </div>
    </div>
  )
}

export default Buynow
