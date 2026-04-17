import { useState, useEffect, useRef } from 'react';
import './Profile.css';
import { useUser, useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const TABS = [
  { key: 'profile',   icon: 'fa-user',          label: 'My Profile' },
  { key: 'address',   icon: 'fa-location-dot',   label: 'Delivery Address' },
  { key: 'orders',    icon: 'fa-bag-shopping',   label: 'Order History' },
  { key: 'viewed',    icon: 'fa-eye',            label: 'Recently Viewed' },
  { key: 'password',  icon: 'fa-lock',           label: 'Change Password' },
  { key: 'logout',    icon: 'fa-right-from-bracket', label: 'Log Out' },
];

const COUNTRY_CODES = [
  { code: '+91',  iso: 'in', name: 'India' },
  { code: '+1',   iso: 'us', name: 'USA/Canada' },
  { code: '+44',  iso: 'gb', name: 'UK' },
  { code: '+61',  iso: 'au', name: 'Australia' },
  { code: '+971', iso: 'ae', name: 'UAE' },
  { code: '+65',  iso: 'sg', name: 'Singapore' },
  { code: '+49',  iso: 'de', name: 'Germany' },
  { code: '+33',  iso: 'fr', name: 'France' },
  { code: '+81',  iso: 'jp', name: 'Japan' },
  { code: '+86',  iso: 'cn', name: 'China' },
  { code: '+92',  iso: 'pk', name: 'Pakistan' },
  { code: '+880', iso: 'bd', name: 'Bangladesh' },
  { code: '+94',  iso: 'lk', name: 'Sri Lanka' },
  { code: '+977', iso: 'np', name: 'Nepal' },
];

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileView, setMobileView] = useState(initialTab !== 'profile' ? 'content' : 'menu');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ phone: '', phoneCode: '+91', addressLine1: '', addressLine2: '', postalCode: '', city: '', district: '', state: '', country: '', birthDD: '', birthMM: '', birthYYYY: '', gender: '' });
  const [pinStatus, setPinStatus] = useState(null);
  const [pinMessage, setPinMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [countryCodeOpen, setCountryCodeOpen] = useState(false);
  const countryDropRef = useRef(null);
  const [recentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recentlyViewed') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    if (user) loadProfileFromDB();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && user) fetchOrders();
  }, [activeTab, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropRef.current && !countryDropRef.current.contains(e.target)) {
        setCountryCodeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProfileFromDB = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${encodeURIComponent(email)}`);
      if (res.data) setEditedInfo({
          phone: res.data.phone || '',
          phoneCode: res.data.phoneCode || '+91',
          addressLine1: res.data.address?.street || '',
          addressLine2: res.data.address?.addressLine2 || '',
          postalCode: res.data.address?.zipCode || '',
          city: res.data.address?.city || '',
          district: res.data.address?.district || '',
          state: res.data.address?.state || '',
          country: res.data.address?.country || '',
          birthDD: res.data.birthDD || '',
          birthMM: res.data.birthMM || '',
          birthYYYY: res.data.birthYYYY || '',
          gender: res.data.gender || ''
        });
    } catch {
      setEditedInfo({ phone: '', phoneCode: '+91', addressLine1: '', addressLine2: '', postalCode: '', city: '', district: '', state: '', country: '', birthDD: '', birthMM: '', birthYYYY: '', gender: '' });
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${user.id}`);
      if (res.data.success) setOrders(res.data.orders);
    } catch { } finally { setOrdersLoading(false); }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/orders/order/${orderId}/cancel`);
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
      }
    } catch { alert('Failed to cancel order.'); } finally { setCancellingId(null); }
  };

  const handlePrintInvoice = (order) => {
    const win = window.open('', '_blank');
    const addr = order.shippingAddress || {};
    const items = (order.products || []).map((p, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
        <td style="padding:11px 14px;font-size:14px;color:#1f2937">${p.title}</td>
        <td style="padding:11px 14px;font-size:14px;color:#6b7280;text-align:center">${p.quantity}</td>
        <td style="padding:11px 14px;font-size:14px;color:#6b7280;text-align:right">₹${p.price.toLocaleString('en-IN')}</td>
        <td style="padding:11px 14px;font-size:14px;font-weight:600;color:#1f2937;text-align:right">₹${(p.price * p.quantity).toLocaleString('en-IN')}</td>
      </tr>`).join('');

    const addrLine = [addr.address, addr.city, addr.district, addr.state].filter(Boolean).join(', ');
    const addrLine2 = [addr.pinCode, addr.country].filter(Boolean).join(', ');

    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Invoice - ${order.orderNumber}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#333;padding:40px;max-width:780px;margin:0 auto;display:flex;flex-direction:column;min-height:100vh}
  .content{flex:1}
  .top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:3px solid #1a1a2e}
  .brand{font-size:32px;font-weight:900;color:#1a1a2e;letter-spacing:4px}
  .brand-sub{font-size:11px;color:#9ca3af;letter-spacing:2px;margin-top:4px}
  .inv-info{text-align:right}
  .inv-info .inv-title{font-size:11px;color:#9ca3af;letter-spacing:2px;text-transform:uppercase}
  .inv-info .inv-num{font-size:20px;font-weight:800;color:#1a1a2e;margin-top:4px}
  .inv-info .inv-date{font-size:13px;color:#6b7280;margin-top:4px}
  .info-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-bottom:32px;padding:20px;background:#f8fafc;border-radius:8px}
  .info-block h4{font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
  .info-block p{font-size:13px;color:#374151;line-height:1.7;margin:0}
  .info-block .name{font-size:15px;font-weight:700;color:#1a1a2e;margin-bottom:4px}
  .status-pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
  .status-pending{background:#fef3c7;color:#92400e}
  .status-processing{background:#dbeafe;color:#1e40af}
  .status-shipped{background:#ede9fe;color:#5b21b6}
  .status-delivered{background:#d1fae5;color:#065f46}
  table{width:100%;border-collapse:collapse;margin-bottom:0}
  thead tr{background:#1a1a2e}
  thead th{padding:11px 14px;font-size:11px;font-weight:600;color:#a0aec0;text-transform:uppercase;letter-spacing:0.5px;text-align:left}
  thead th:not(:first-child){text-align:right}
  thead th:nth-child(2){text-align:center}
  tbody tr:last-child td{border-bottom:2px solid #1a1a2e}
  .totals-section{display:flex;justify-content:flex-end;margin-top:0}
  .totals-table{width:260px;border-collapse:collapse}
  .totals-table td{padding:9px 14px;font-size:14px;color:#6b7280;border-bottom:1px solid #f0f0f0}
  .totals-table td:last-child{text-align:right;color:#1f2937}
  .totals-table tr.grand td{font-size:16px;font-weight:800;color:#1a1a2e;border-top:2px solid #1a1a2e;border-bottom:none;padding-top:12px}
  .payment-bar{margin-top:28px;padding:14px 18px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;display:flex;justify-content:space-between;align-items:center}
  .payment-bar span{font-size:13px;color:#374151}
  .paid{background:#22c55e;color:white;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px}
  .footer{margin-top:auto;padding-top:24px;border-top:1px solid #e5e7eb;text-align:center}
  .footer p{font-size:12px;color:#9ca3af;line-height:1.8}
  .footer .footer-brand{font-size:14px;font-weight:700;color:#1a1a2e;margin-bottom:4px}
  .footer .footer-time{font-size:11px;color:#d1d5db;margin-top:6px}
  @media print{body{padding:20px}@page{margin:0.5cm}}
</style></head><body>
<div class="content">
  <div class="top">
    <div>
      <div class="brand">JELWO</div>
      <div class="brand-sub">FINE JEWELLERY</div>
    </div>
    <div class="inv-info">
      <div class="inv-title">Invoice</div>
      <div class="inv-num">#${order.orderNumber}</div>
      <div class="inv-date">${new Date(order.createdAt).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})} · ${new Date(order.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
    </div>
  </div>

  <div class="info-row">
    <div class="info-block">
      <h4>Bill To</h4>
      <p class="name">${order.customerInfo?.firstName || ''} ${order.customerInfo?.lastName || ''}</p>
      <p>${order.customerInfo?.email || ''}</p>
      <p>${order.customerInfo?.phone || ''}</p>
    </div>
    <div class="info-block">
      <h4>Ship To</h4>
      <p>${addrLine}</p>
      <p>${addrLine2}</p>
    </div>
    <div class="info-block" style="text-align:right">
      <h4>Order Info</h4>
      <p>Method: <strong>${(order.shippingMethod || 'ship').toUpperCase()}</strong></p>
      <p>Payment: <strong>${(order.paymentInfo?.method || 'Razorpay').toUpperCase()}</strong></p>
      <p style="margin-top:6px"><span class="status-pill status-${order.status}">${order.status}</span></p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${items}</tbody>
  </table>

  <div class="totals-section">
    <table class="totals-table">
      <tr><td>Subtotal</td><td>₹${order.subtotal?.toLocaleString('en-IN')}</td></tr>
      <tr><td>Shipping</td><td>${order.shippingCost === 0 ? 'FREE' : '₹' + order.shippingCost}</td></tr>
      <tr><td>Tax</td><td>₹0</td></tr>
      <tr class="grand"><td>Total</td><td>₹${order.total?.toLocaleString('en-IN')}</td></tr>
    </table>
  </div>

  <div class="payment-bar">
    <span>Paid via <strong>${(order.paymentInfo?.method || 'Razorpay').toUpperCase()}</strong>${order.paymentInfo?.razorpayPaymentId ? ' · ' + order.paymentInfo.razorpayPaymentId : ''}</span>
    <span class="paid">✓ PAID</span>
  </div>
</div>

  <div class="footer">
    <p class="footer-brand">Jelwo Fine Jewellery</p>
    <p>Thank you for your purchase! For any queries, reach us at <strong>jelwo1824@gmail.com</strong></p>
    <p class="footer-time">Generated on ${new Date().toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})} at ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</p>
  </div>

<script>window.onload=()=>window.print()</script>
</body></html>`);
    win.document.close();
  };

  const TRACKING_STEPS = ['pending','processing','shipped','delivered'];
  const getTrackingStep = (status) => {
    if (status === 'cancelled' || status === 'payment_failed') return -1;
    return TRACKING_STEPS.indexOf(status);
  };

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
        const { District, State } = data[0].PostOffice[0];
        setEditedInfo(p => ({ ...p, district: District, state: State }));
        setPinStatus('valid');
        setPinMessage(`✓ ${District}, ${State}`);
      } else {
        setPinStatus('invalid');
        setPinMessage('Invalid PIN code — not found');
        setEditedInfo(p => ({ ...p, district: '' }));
      }
    } catch {
      setPinStatus(null);
      setPinMessage('');
    }
  };

  const handleSave = async () => {
    // Validate phone
    if (editedInfo.phone && editedInfo.phoneCode === '+91' && !/^\d{10}$/.test(editedInfo.phone)) {
      setPhoneError('Contact number must be exactly 10 digits');
      return;
    }
    setPhoneError('');
    setSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/profile/upsert`, {
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        phone: editedInfo.phone,
        phoneCode: editedInfo.phoneCode,
        addressLine1: editedInfo.addressLine1,
        addressLine2: editedInfo.addressLine2,
        postalCode: editedInfo.postalCode,
        city: editedInfo.city,
        district: editedInfo.district,
        state: editedInfo.state,
        country: editedInfo.country,
        birthDD: editedInfo.birthDD,
        birthMM: editedInfo.birthMM,
        birthYYYY: editedInfo.birthYYYY,
        gender: editedInfo.gender
      });
      setIsEditing(false);
    } catch { alert('Failed to save. Try again.'); } finally { setSaving(false); }
  };

  const getStatusColor = (s) => ({ pending:'#f59e0b', processing:'#3b82f6', shipped:'#8b5cf6', delivered:'#10b981', cancelled:'#ef4444', payment_failed:'#ef4444' }[s] || '#6b7280');

  const handleTabClick = (key) => {
    if (key === 'logout') { signOut(); return; }
    setActiveTab(key);
    setMobileView('content');
  };

  const initials = user?.firstName?.charAt(0).toUpperCase() + (user?.lastName?.charAt(0).toUpperCase() || '');
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

  if (!isLoaded) return <div className="pf-loading"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="pf-container">
      <h1 className="pf-page-title">MY ACCOUNT</h1>
      <div className="pf-mobile-account-header">
        {mobileView === 'content' ? (
          <button className="pf-mobile-back-btn" onClick={() => setMobileView('menu')}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>{TABS.find(t => t.key === activeTab)?.label}</span>
          </button>
        ) : (
          'My Account'
        )}
      </div>

      <div className="pf-layout">
        <aside className={`pf-sidebar ${mobileView === 'content' ? 'pf-sidebar-hidden-mobile' : ''}`}>
          <div className="pf-sidebar-user">
            <div className="pf-avatar-sm">
              {user?.imageUrl
                ? <img src={user.imageUrl} alt={user.fullName} />
                : <span>{initials}</span>}
            </div>
            <div className="pf-sidebar-user-info">
              <p className="pf-sidebar-user-name">{user?.firstName} {user?.lastName}</p>
              <p className="pf-sidebar-user-email">{user?.primaryEmailAddress?.emailAddress}</p>
              {editedInfo.phone && <p className="pf-sidebar-user-phone">{editedInfo.phoneCode} {editedInfo.phone}</p>}
            </div>
          </div>

          <nav className="pf-nav">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`pf-nav-item ${activeTab === tab.key ? 'active' : ''} ${tab.key === 'logout' ? 'logout' : ''}`}
                onClick={() => handleTabClick(tab.key)}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className={`pf-main ${mobileView === 'menu' ? 'pf-main-hidden-mobile' : ''}`}>

          {activeTab === 'profile' && (
            <div className="pf-card">
              <div className="pf-card-header">
                <h2 className="pf-desktop-greeting">{greeting()}!</h2>
                <h2 className="pf-mobile-section-title">My Profile</h2>
                {/* Desktop only top buttons */}
                <div className="pf-header-actions-desktop">
                  {!isEditing
                    ? <button className="pf-edit-btn" onClick={() => setIsEditing(true)}><i className="fa-solid fa-pen-to-square"></i></button>
                    : <div className="d-flex gap-2">
                        <button className="pf-save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                        <button className="pf-cancel-btn" onClick={() => { setIsEditing(false); setPhoneError(''); loadProfileFromDB(); }}>Cancel</button>
                      </div>
                  }
                </div>
              </div>
              <div className="pf-profile-grid">
                <div className="pf-field">
                  <label>First Name</label>
                  <div className="pf-field-value">{user?.firstName || '—'}</div>
                </div>
                <div className="pf-field">
                  <label>Last Name</label>
                  <div className="pf-field-value">{user?.lastName || '—'}</div>
                </div>
                <div className="pf-field">
                  <label>Email</label>
                  <div className="pf-field-value">{user?.primaryEmailAddress?.emailAddress}</div>
                </div>
                <div className="pf-field">
                  <label>Contact Number</label>
                  {isEditing
                    ? <>
                        <div className={`pf-phone-wrap${phoneError ? ' pf-phone-wrap-error' : ''}`}>
                          <div className="pf-flag-dropdown" ref={countryDropRef}>
                            <button type="button" className="pf-flag-trigger" onClick={() => setCountryCodeOpen(o => !o)}>
                              <img
                                src={`https://flagcdn.com/w40/${COUNTRY_CODES.find(c => c.code === editedInfo.phoneCode)?.iso || 'in'}.png`}
                                alt="flag" className="pf-flag-img"
                              />
                              <span className="pf-dialcode">{editedInfo.phoneCode}</span>
                              <i className="fa-solid fa-chevron-down pf-flag-chevron"></i>
                            </button>
                            {countryCodeOpen && (
                              <ul className="pf-flag-list">
                                {COUNTRY_CODES.map(c => (
                                  <li key={c.code}
                                    className={`pf-flag-option ${editedInfo.phoneCode === c.code ? 'active' : ''}`}
                                    onClick={() => { setEditedInfo(p => ({...p, phoneCode: c.code})); setCountryCodeOpen(false); }}
                                  >
                                    <img src={`https://flagcdn.com/w40/${c.iso}.png`} alt={c.name} className="pf-flag-img" />
                                    <span>{c.name}</span>
                                    <span className="pf-flag-code">{c.code}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="pf-phone-divider" />
                          <input
                            className="pf-phone-bare-input"
                            value={editedInfo.phone}
                            maxLength={15}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                              setEditedInfo(p => ({...p, phone: val}));
                              const isIndia = editedInfo.phoneCode === '+91';
                              setPhoneError(val && isIndia && val.length !== 10 ? 'Contact number must be exactly 10 digits' : '');
                            }}
                            placeholder="Enter Phone Number"
                          />
                        </div>
                        {phoneError && <p className="pf-pin-msg pf-pin-error">{phoneError}</p>}
                      </>
                    : <div className="pf-field-value">
                        {editedInfo.phone
                          ? <span className="pf-phone-display">
                              <img src={`https://flagcdn.com/w40/${COUNTRY_CODES.find(c=>c.code===editedInfo.phoneCode)?.iso||'in'}.png`} alt="" className="pf-flag-img-sm" />
                              {editedInfo.phoneCode} {editedInfo.phone}
                            </span>
                          : '—'}
                      </div>}
                </div>
                <div className="pf-field">
                  <label>Member Since</label>
                  <div className="pf-field-value">{new Date(user?.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="pf-field pf-field-full">
                  <label>Birthdate</label>
                  {isEditing ? (
                    <div className="pf-birth-row">
                      <select className="pf-select" value={editedInfo.birthDD} onChange={e => setEditedInfo(p => ({...p, birthDD: e.target.value}))}>
                        <option value="">DD</option>
                        {Array.from({length:31},(_,i)=>String(i+1).padStart(2,'0')).map(d=><option key={d} value={d}>{d}</option>)}
                      </select>
                      <select className="pf-select" value={editedInfo.birthMM} onChange={e => setEditedInfo(p => ({...p, birthMM: e.target.value}))}>
                        <option value="">MM</option>
                        {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m=><option key={m} value={m}>{m}</option>)}
                      </select>
                      <select className="pf-select pf-select-year" value={editedInfo.birthYYYY} onChange={e => setEditedInfo(p => ({...p, birthYYYY: e.target.value}))}>
                        <option value="">YYYY</option>
                        {Array.from({length:100},(_,i)=>String(new Date().getFullYear()-i)).map(y=><option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="pf-field-value">
                      {editedInfo.birthDD && editedInfo.birthMM && editedInfo.birthYYYY
                        ? `${editedInfo.birthDD} / ${editedInfo.birthMM} / ${editedInfo.birthYYYY}`
                        : '—'}
                    </div>
                  )}
                </div>
                <div className="pf-field pf-field-full">
                  <label>Gender</label>
                  {isEditing ? (
                    <div className="pf-gender-row">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button key={g} type="button"
                          className={`pf-gender-pill ${editedInfo.gender === g ? 'selected' : ''}`}
                          onClick={() => setEditedInfo(p => ({...p, gender: g}))}>
                          {g}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="pf-field-value">{editedInfo.gender || '—'}</div>
                  )}
                </div>
              </div>

              {/* Bottom action buttons — mobile only */}
              <div className="pf-bottom-actions-mobile">
                {!isEditing
                  ? <button className="pf-bottom-edit-btn" onClick={() => setIsEditing(true)}>
                      <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                    </button>
                  : <div className="pf-bottom-save-row">
                      <button className="pf-bottom-save-btn" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button className="pf-bottom-cancel-btn" onClick={() => { setIsEditing(false); setPhoneError(''); loadProfileFromDB(); }}>
                        Cancel
                      </button>
                    </div>
                }
              </div>
            </div>
          )}

          {/* DELIVERY ADDRESS */}
          {activeTab === 'address' && (
            <div className="pf-card">
              <div className="pf-card-header">
                <h2>Delivery Address</h2>
                {!isEditing
                  ? <button className="pf-edit-btn" onClick={() => setIsEditing(true)}><i className="fa-solid fa-pen-to-square"></i></button>
                  : <div className="d-flex gap-2">
                      <button className="pf-save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                      <button className="pf-cancel-btn" onClick={() => { setIsEditing(false); loadProfileFromDB(); }}>Cancel</button>
                    </div>
                }
              </div>

              {isEditing ? (
                <div className="pf-addr-grid">

                  {/* 1. Address */}
                  <div className="pf-field pf-field-full">
                    <div className="pf-fl-wrap">
                      <label className="pf-fl-label">Address</label>
                      <input className="pf-input pf-fl-input" value={editedInfo.addressLine1} onChange={e => setEditedInfo(p => ({...p, addressLine1: e.target.value}))} />
                    </div>
                  </div>

                  {/* 2. Address (optional) with same-as checkbox inline */}
                  <div className="pf-field pf-field-full">
                    <div className="pf-fl-wrap">
                      <label className="pf-fl-label">Apartment, suite, etc. (optional)</label>
                      <input className="pf-input pf-fl-input" value={editedInfo.addressLine2} onChange={e => setEditedInfo(p => ({...p, addressLine2: e.target.value}))} />
                    </div>
                    <label className="pf-same-check mt-1">
                      <input type="checkbox"
                        checked={editedInfo.addressLine2 === editedInfo.addressLine1 && !!editedInfo.addressLine1}
                        onChange={e => setEditedInfo(p => ({...p, addressLine2: e.target.checked ? p.addressLine1 : ''}))}
                      />
                      <span>Same as address</span>
                    </label>
                  </div>

                  {/* 3. Country */}
                  <div className="pf-field pf-field-full">
                    <div className="pf-fl-wrap">
                      <label className="pf-fl-label">Country / Region</label>
                      <select className="pf-input pf-fl-input pf-select-full" value={editedInfo.country} onChange={e => setEditedInfo(p => ({...p, country: e.target.value}))}>
                        <option value=""></option>
                        {['India','United States','United Kingdom','Canada','Australia','UAE','Singapore','Germany','France','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* 4+5. City + District */}
                  <div className="pf-field pf-field-half">
                    <div className="pf-fl-wrap">
                      <label className="pf-fl-label">City / Town</label>
                      <input className="pf-input pf-fl-input" value={editedInfo.city} onChange={e => setEditedInfo(p => ({...p, city: e.target.value}))} />
                    </div>
                  </div>
                  <div className="pf-field pf-field-half">
                    <div className="pf-fl-wrap">
                      <label className="pf-fl-label">District</label>
                      <input className="pf-input pf-fl-input" value={editedInfo.district} onChange={e => setEditedInfo(p => ({...p, district: e.target.value}))} />
                    </div>
                  </div>

                  {/* 6+7. State + PIN */}
                  <div className="pf-field pf-field-half">
                    <div className="pf-fl-wrap">
                      <label className="pf-fl-label">State</label>
                      <input className="pf-input pf-fl-input" value={editedInfo.state || ''} onChange={e => setEditedInfo(p => ({...p, state: e.target.value}))} />
                    </div>
                  </div>
                  <div className="pf-field pf-field-half">
                    <div className="pf-fl-wrap">
                      <label className="pf-fl-label">PIN code</label>
                      <input
                        className={`pf-input pf-fl-input ${pinStatus === 'invalid' ? 'pf-input-error' : pinStatus === 'valid' ? 'pf-input-success' : ''}`}
                        maxLength={6}
                        value={editedInfo.postalCode}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setEditedInfo(p => ({...p, postalCode: val}));
                          if (val.length === 6) validatePincode(val);
                          else { setPinStatus(null); setPinMessage(''); setEditedInfo(p => ({...p, district: ''})); }
                        }}
                      />
                    </div>
                    {pinMessage && (
                      <p className={`pf-pin-msg ${pinStatus === 'valid' ? 'pf-pin-valid' : pinStatus === 'validating' ? 'pf-pin-validating' : 'pf-pin-error'}`}>
                        {pinStatus === 'validating' && <span className="spinner-border spinner-border-sm me-1" style={{width:'10px',height:'10px'}}></span>}
                        {pinMessage}
                      </p>
                    )}
                  </div>

                  {/* 8. Phone */}
                  <div className="pf-field pf-field-half">
                    <label style={{display:'block', fontSize:'12px', color:'#9ca3af', marginBottom:'6px', fontWeight:'500'}}>Phone Number</label>
                    <div className={`pf-phone-wrap${phoneError ? ' pf-phone-wrap-error' : ''}`}>
                      <div className="pf-flag-dropdown" ref={countryDropRef}>
                        <button type="button" className="pf-flag-trigger" onClick={() => setCountryCodeOpen(o => !o)}>
                          <img
                            src={`https://flagcdn.com/w40/${COUNTRY_CODES.find(c => c.code === editedInfo.phoneCode)?.iso || 'in'}.png`}
                            alt="flag" className="pf-flag-img"
                          />
                          <span className="pf-dialcode">{editedInfo.phoneCode}</span>
                          <i className="fa-solid fa-chevron-down pf-flag-chevron"></i>
                        </button>
                        {countryCodeOpen && (
                          <ul className="pf-flag-list">
                            {COUNTRY_CODES.map(c => (
                              <li key={c.code}
                                className={`pf-flag-option ${editedInfo.phoneCode === c.code ? 'active' : ''}`}
                                onClick={() => { setEditedInfo(p => ({...p, phoneCode: c.code})); setCountryCodeOpen(false); }}
                              >
                                <img src={`https://flagcdn.com/w40/${c.iso}.png`} alt={c.name} className="pf-flag-img" />
                                <span>{c.name}</span>
                                <span className="pf-flag-code">{c.code}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="pf-phone-divider" />
                      <input
                        className="pf-phone-bare-input"
                        value={editedInfo.phone}
                        maxLength={15}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                          setEditedInfo(p => ({...p, phone: val}));
                          const isIndia = editedInfo.phoneCode === '+91';
                          setPhoneError(val && isIndia && val.length !== 10 ? 'Contact number must be exactly 10 digits' : '');
                        }}
                        placeholder="Enter Phone Number"
                      />
                    </div>
                    {phoneError && <p className="pf-pin-msg pf-pin-error">{phoneError}</p>}
                  </div>

                </div>
              ) : (
                editedInfo.addressLine1 || editedInfo.city
                  ? <div className="pf-address-box">
                      <i className="fa-solid fa-location-dot"></i>
                      <div>
                        {editedInfo.addressLine1 && <p>{editedInfo.addressLine1}</p>}
                        {editedInfo.addressLine2 && editedInfo.addressLine2 !== editedInfo.addressLine1 && <p>{editedInfo.addressLine2}</p>}
                        <p>{[editedInfo.city, editedInfo.district, editedInfo.state, editedInfo.postalCode, editedInfo.country].filter(Boolean).join(', ')}</p>
                        {editedInfo.phone && <p>📞 {editedInfo.phoneCode} {editedInfo.phone}</p>}
                      </div>
                    </div>
                  : <div className="pf-empty">
                      <i className="fa-solid fa-location-dot"></i>
                      <p>No address saved yet.</p>
                      <button className="pf-save-btn" onClick={() => setIsEditing(true)}>Add Address</button>
                    </div>
              )}
            </div>
          )}

          {/* ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="pf-card">
              <div className="pf-card-header"><h2>Order History</h2></div>
              {ordersLoading
                ? <div className="text-center p-4"><div className="spinner-border text-danger"></div></div>
                : orders.length === 0
                  ? <div className="pf-orders-empty">
                      <div className="pf-orders-empty-icon">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <ellipse cx="40" cy="68" rx="28" ry="6" fill="#e8f0fe" opacity="0.6"/>
                          <rect x="18" y="34" width="44" height="30" rx="3" stroke="#93b4f5" strokeWidth="2" fill="white"/>
                          <path d="M18 37l22-18 22 18" stroke="#93b4f5" strokeWidth="2" fill="none"/>
                          <path d="M30 34v-6a10 10 0 0120 0v6" stroke="#93b4f5" strokeWidth="2" fill="none" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p className="pf-orders-empty-text">Your past orders will appear here.<br/>It looks like you haven't placed any orders yet.</p>
                      <p className="pf-orders-empty-cta">Then let's get started with discovering our amazing collection now!</p>
                      <Link to="/collections" className="pf-save-btn mt-3">Start Shopping</Link>
                    </div>
                  : orders.map(order => (
                    <div key={order._id} className="pf-order-card">
                      {/* Order Header — always visible */}
                      <div className="pf-order-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} style={{cursor:'pointer'}}>
                        <div>
                          <p className="pf-order-num">Order #{order.orderNumber}</p>
                          <p className="pf-order-date">{new Date(order.createdAt).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</p>
                        </div>
                        <div className="pf-order-header-right">
                          <span className="pf-status-badge" style={{background: getStatusColor(order.status)}}>{order.status}</span>
                          <span className="pf-order-total">₹{order.total}</span>
                          <i className={`fa-solid fa-chevron-${expandedOrder === order._id ? 'up' : 'down'} pf-chevron`}></i>
                        </div>
                      </div>

                      {/* Products preview (always visible) */}
                      <div className="pf-order-products-preview">
                        {order.products.map((p, i) => (
                          <Link to={`/product/${p.productId?._id || p.productId}`} key={i} className="pf-order-product">
                            <img src={`${import.meta.env.VITE_API_IMAGE}/${p.frontImg}`} alt={p.title} />
                            <div className="pf-order-product-info">
                              <p>{p.title}</p>
                              <span>Qty: {p.quantity} &nbsp;·&nbsp; ₹{p.price}</span>
                            </div>
                            <span className="pf-order-price">₹{p.price * p.quantity}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Expanded detail */}
                      {expandedOrder === order._id && (
                        <div className="pf-order-detail">

                          {/* Tracking */}
                          <div className="pf-tracking">
                            <h4><i className="fa-solid fa-truck-fast"></i> Order Tracking</h4>
                            {order.status === 'cancelled' || order.status === 'payment_failed'
                              ? <div className="pf-tracking-cancelled">
                                  <i className="fa-solid fa-circle-xmark"></i>
                                  <span>Order {order.status === 'cancelled' ? 'Cancelled' : 'Payment Failed'}</span>
                                </div>
                              : <div className="pf-tracking-steps">
                                  {TRACKING_STEPS.map((step, idx) => {
                                    const current = getTrackingStep(order.status);
                                    const done = idx <= current;
                                    const icons = ['fa-clock','fa-gear','fa-truck','fa-circle-check'];
                                    const labels = ['Order Placed','Processing','Shipped','Delivered'];
                                    return (
                                      <div key={step} className={`pf-track-step ${done ? 'done' : ''}`}>
                                        <div className="pf-track-icon"><i className={`fa-solid ${icons[idx]}`}></i></div>
                                        <span>{labels[idx]}</span>
                                        {idx < TRACKING_STEPS.length - 1 && <div className={`pf-track-line ${done && idx < current ? 'done' : ''}`}></div>}
                                      </div>
                                    );
                                  })}
                                </div>
                            }
                            {order.trackingNumber && (
                              <p className="pf-tracking-num"><i className="fa-solid fa-barcode"></i> Tracking #: <strong>{order.trackingNumber}</strong></p>
                            )}
                          </div>

                          {/* Shipping & Payment info */}
                          <div className="pf-order-info-grid">
                            <div className="pf-order-info-box">
                              <h4><i className="fa-solid fa-location-dot"></i> Shipping Address</h4>
                              <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                              <p>{order.shippingAddress?.address}{order.shippingAddress?.apartment ? ', ' + order.shippingAddress.apartment : ''}</p>
                              <p>{order.shippingAddress?.city}{order.shippingAddress?.district ? ', ' + order.shippingAddress.district : ''}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}</p>
                              <p>{order.shippingAddress?.country}</p>
                            </div>
                            <div className="pf-order-info-box">
                              <h4><i className="fa-solid fa-credit-card"></i> Payment</h4>
                              <p>Method: <strong>{order.paymentInfo?.method?.toUpperCase()}</strong></p>
                              <p>Status: <strong style={{color: order.paymentInfo?.status === 'completed' ? '#10b981' : '#ef4444'}}>{order.paymentInfo?.status}</strong></p>
                              <p>Subtotal: ₹{order.subtotal}</p>
                              <p>Shipping: {order.shippingCost === 0 ? 'FREE' : '₹' + order.shippingCost}</p>
                              <p><strong>Total: ₹{order.total}</strong></p>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="pf-order-actions">
                            <button className="pf-invoice-btn" onClick={() => handlePrintInvoice(order)}>
                              <i className="fa-solid fa-file-invoice"></i> Download Invoice
                            </button>
                            {['pending','processing'].includes(order.status) && (
                              <button
                                className="pf-cancel-order-btn"
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={cancellingId === order._id}
                              >
                                <i className="fa-solid fa-xmark"></i>
                                {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                              </button>
                            )}
                          </div>

                        </div>
                      )}
                    </div>
                  ))
              }
            </div>
          )}

          {/* RECENTLY VIEWED */}
          {activeTab === 'viewed' && (
            <div className="pf-card">
              <div className="pf-card-header"><h2>Recently Viewed</h2></div>
              {recentlyViewed.length === 0
                ? <div className="pf-empty"><i className="fa-solid fa-eye"></i><p>No recently viewed products.</p></div>
                : <div className="pf-viewed-grid">
                    {recentlyViewed.map(p => (
                      <Link to={`/product/${p._id}`} key={p._id} className="pf-viewed-card">
                        <img src={`${import.meta.env.VITE_API_IMAGE}/${p.frontImg}`} alt={p.title} />
                        <p>{p.title}</p>
                        <span>Rs. {p.price}</span>
                      </Link>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="pf-card">
              <div className="pf-card-header"><h2>Change Password</h2></div>
              <div className="pf-empty">
                <i className="fa-solid fa-lock"></i>
                <p>Update your password and manage account security.</p>
                <button className="pf-save-btn" onClick={() => openUserProfile()}>Manage Password</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Profile;
