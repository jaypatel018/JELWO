import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCoupons.css';

const EMPTY = { code: '', discountType: 'percentage', discountValue: '', minOrder: '', maxDiscount: '', expiryDate: '', isActive: true };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/coupons`);
      setCoupons(res.data.coupons || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/coupons/${editId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/coupons`, form);
      }
      setForm(EMPTY); setEditId(null); setShowForm(false);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving coupon');
    } finally { setSaving(false); }
  };

  const handleEdit = (c) => {
    setForm({ ...c, expiryDate: c.expiryDate?.slice(0, 10), maxDiscount: c.maxDiscount ?? '' });
    setEditId(c._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/coupons/${id}/toggle`);
    fetchCoupons();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/coupons/${id}`);
    fetchCoupons();
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const isExpired = (d) => d && new Date(d) < new Date();

  return (
    <div className="ac-container">
      <div className="ac-header">
        <h2><i className="fa-solid fa-ticket"></i> Coupons</h2>
        <button className="ac-add-btn" onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(!showForm); }}>
          <i className="fa-solid fa-plus"></i> {showForm ? 'Cancel' : 'Add Coupon'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="ac-form-card">
          <h3>{editId ? 'Edit Coupon' : 'New Coupon'}</h3>
          <form onSubmit={handleSubmit} className="ac-form">
            <div className="ac-form-row">
              <div className="ac-field">
                <label>Coupon Code *</label>
                <input type="text" placeholder="e.g. SAVE20" value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
              </div>
              <div className="ac-field">
                <label>Discount Type *</label>
                <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>
              <div className="ac-field">
                <label>Discount Value *</label>
                <input type="number" min="0" placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 100'}
                  value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} required />
              </div>
            </div>
            <div className="ac-form-row">
              <div className="ac-field">
                <label>Min Order Amount (₹)</label>
                <input type="number" min="0" placeholder="0 = no minimum"
                  value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} />
              </div>
              <div className="ac-field">
                <label>Max Discount (₹) <span style={{fontWeight:400,color:'#9ca3af',fontSize:'12px'}}>% coupons only</span></label>
                <input type="number" min="0" placeholder="Leave empty = no cap"
                  value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })}
                  disabled={form.discountType === 'flat'} />
              </div>
              <div className="ac-field">
                <label>Expiry Date *</label>
                <input type="date" value={form.expiryDate}
                  onChange={e => setForm({ ...form, expiryDate: e.target.value })} required />
              </div>
              <div className="ac-field ac-field-toggle">
                <label>Active</label>
                <label className="ac-toggle">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  <span className="ac-toggle-slider"></span>
                </label>
              </div>
            </div>
            <button type="submit" className="ac-save-btn" disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="ac-loading"><i className="fa-solid fa-spinner fa-spin"></i> Loading...</div>
      ) : coupons.length === 0 ? (
        <div className="ac-empty"><i className="fa-solid fa-ticket"></i><p>No coupons yet. Add one above.</p></div>
      ) : (
        <div className="ac-table-wrap">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Order</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c._id}>
                  <td><span className="ac-code">{c.code}</span></td>
                  <td>{c.discountType === 'percentage' ? 'Percentage' : 'Flat'}</td>
                  <td className="ac-value">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                  </td>
                  <td>{c.minOrder > 0 ? `₹${c.minOrder}` : 'No min'}</td>
                  <td className={isExpired(c.expiryDate) ? 'ac-expired' : ''}>{formatDate(c.expiryDate)}</td>
                  <td>
                    <button className={`ac-status-btn ${c.isActive ? 'active' : 'inactive'}`} onClick={() => handleToggle(c._id)}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="ac-actions">
                    <button className="ac-edit-btn" onClick={() => handleEdit(c)} title="Edit">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button className="ac-del-btn" onClick={() => handleDelete(c._id)} title="Delete">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
