import React, { useEffect, useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import "./AdminOrders.css";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/all`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/order/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

  const statusColor = { pending: "#f59e0b", processing: "#3b82f6", shipped: "#8b5cf6", delivered: "#10b981", cancelled: "#ef4444", payment_failed: "#ef4444" };

  const downloadExcel = async () => {
    if (filtered.length === 0) {
      alert("No orders to download");
      return;
    }

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders", {
      views: [{ state: "frozen", ySplit: 1 }]
    });

    // Define columns
    worksheet.columns = [
      { header: "Sr.", key: "sr", width: 6 },
      { header: "Order Number", key: "orderNumber", width: 18 },
      { header: "Date", key: "date", width: 14 },
      { header: "Customer Name", key: "customerName", width: 22 },
      { header: "Email", key: "email", width: 28 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "Items", key: "items", width: 8 },
      { header: "Products", key: "products", width: 45 },
      { header: "Subtotal (₹)", key: "subtotal", width: 14 },
      { header: "Shipping (₹)", key: "shipping", width: 14 },
      { header: "Total (₹)", key: "total", width: 14 },
      { header: "Payment Method", key: "paymentMethod", width: 16 },
      { header: "Payment Status", key: "paymentStatus", width: 16 },
      { header: "Order Status", key: "orderStatus", width: 16 },
      { header: "City", key: "city", width: 16 },
      { header: "State", key: "state", width: 16 },
      { header: "PIN", key: "pin", width: 10 },
      { header: "Full Address", key: "fullAddress", width: 55 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4361EE" }
    };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(1).height = 25;
    worksheet.getRow(1).border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };

    // Add data rows
    filtered.forEach((order, idx) => {
      const row = worksheet.addRow({
        sr: idx + 1,
        orderNumber: order.orderNumber,
        date: formatDate(order.createdAt),
        customerName: `${order.customerInfo?.firstName || ''} ${order.customerInfo?.lastName || ''}`.trim(),
        email: order.customerInfo?.email || '',
        phone: order.customerInfo?.phone || '',
        items: order.products?.length || 0,
        products: order.products?.map(p => `${p.title} (×${p.quantity})`).join(', ') || '',
        subtotal: order.subtotal,
        shipping: order.shippingCost,
        total: order.total,
        paymentMethod: order.paymentInfo?.method?.toUpperCase() || '',
        paymentStatus: order.paymentInfo?.status || '',
        orderStatus: order.status,
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        pin: order.shippingAddress?.pinCode || '',
        fullAddress: `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.apartment || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.district || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pinCode || ''}, ${order.shippingAddress?.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').trim(),
      });

      // Alternating row colors
      const rowColor = idx % 2 === 0 ? "FFF8F9FA" : "FFFFFFFF";
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowColor }
      };

      // Add borders to all cells
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } }
        };
        cell.alignment = { vertical: "middle", wrapText: true };
      });

      // Order Status coloring
      const orderStatusCell = row.getCell("orderStatus");
      const status = order.status?.toLowerCase();
      let statusBg = "FFFFFFFF";
      let statusFont = "FF000000";

      if (status === "delivered") { statusBg = "FFD1FAE5"; statusFont = "FF065F46"; }
      else if (status === "shipped") { statusBg = "FFE9D5FF"; statusFont = "FF6B21A8"; }
      else if (status === "processing") { statusBg = "FFDBEAFE"; statusFont = "FF1E40AF"; }
      else if (status === "pending") { statusBg = "FFFEF3C7"; statusFont = "FF92400E"; }
      else if (status === "cancelled" || status === "payment_failed") { statusBg = "FFFEE2E2"; statusFont = "FF991B1B"; }

      orderStatusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: statusBg } };
      orderStatusCell.font = { bold: true, color: { argb: statusFont } };
      orderStatusCell.alignment = { vertical: "middle", horizontal: "center" };

      // Payment Status coloring
      const paymentStatusCell = row.getCell("paymentStatus");
      const payStatus = order.paymentInfo?.status?.toLowerCase();
      if (payStatus === "completed") {
        paymentStatusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD1FAE5" } };
        paymentStatusCell.font = { bold: true, color: { argb: "FF065F46" } };
      } else {
        paymentStatusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
        paymentStatusCell.font = { bold: true, color: { argb: "FF991B1B" } };
      }
      paymentStatusCell.alignment = { vertical: "middle", horizontal: "center" };

      // Number formatting for amounts
      row.getCell("subtotal").numFmt = '₹#,##0.00';
      row.getCell("subtotal").alignment = { vertical: "middle", horizontal: "right" };
      row.getCell("subtotal").font = { bold: true };

      row.getCell("shipping").numFmt = '₹#,##0.00';
      row.getCell("shipping").alignment = { vertical: "middle", horizontal: "right" };
      row.getCell("shipping").font = { bold: true };

      row.getCell("total").numFmt = '₹#,##0.00';
      row.getCell("total").alignment = { vertical: "middle", horizontal: "right" };
      row.getCell("total").font = { bold: true };

      // Center align for specific columns
      row.getCell("sr").alignment = { vertical: "middle", horizontal: "center" };
      row.getCell("items").alignment = { vertical: "middle", horizontal: "center" };
      row.getCell("pin").alignment = { vertical: "middle", horizontal: "center" };
    });

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Jelwo_Orders_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerInfo?.email?.toLowerCase().includes(search.toLowerCase()) ||
      `${o.customerInfo?.firstName} ${o.customerInfo?.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="ao-loading"><i className="fa-solid fa-spinner fa-spin"></i> Loading orders...</div>
  );

  return (
    <div className="ao-container">
      {/* Header */}
      <div className="ao-header">
        <h2><i className="fa-solid fa-bag-shopping"></i> Orders</h2>
        <div className="ao-header-right">
          <input
            className="ao-search"
            type="text"
            placeholder="Search by order #, name, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="ao-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button className="ao-download-btn" onClick={downloadExcel} title="Export orders data">
            <i className="fa-solid fa-download"></i> Export Data
          </button>
          <div className="ao-count">Total: <strong>{filtered.length}</strong></div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="ao-empty"><i className="fa-solid fa-inbox"></i><p>No orders found</p></div>
      ) : (
        <div className="ao-table-wrap">
          <table className="ao-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order No.</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, idx) => (
                <React.Fragment key={order._id}>
                  <tr className={expandedId === order._id ? "ao-row-expanded" : ""}>
                    <td>{idx + 1}</td>
                    <td className="ao-order-num">{order.orderNumber}</td>
                    <td>{order.customerInfo?.firstName} {order.customerInfo?.lastName}</td>
                    <td className="ao-email">{order.customerInfo?.email}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.products?.length || 0}</td>
                    <td className="ao-total">₹{order.total}</td>
                    <td>
                      <span className="ao-pay-badge" style={{ color: order.paymentInfo?.status === "completed" ? "#10b981" : "#ef4444" }}>
                        {order.paymentInfo?.status || "—"}
                      </span>
                    </td>
                    <td>
                      {['cancelled', 'payment_failed'].includes(order.status) ? (
                        <span className="ao-status-select" style={{
                          borderColor: statusColor[order.status],
                          color: statusColor[order.status],
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: `1.5px solid ${statusColor[order.status]}`,
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-block',
                          background: '#fff5f5'
                        }}>
                          {order.status === 'cancelled' ? 'Cancelled' : 'Payment Failed'}
                        </span>
                      ) : (
                        <select
                          className="ao-status-select"
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          style={{ borderColor: statusColor[order.status] || "#ccc", color: statusColor[order.status] || "#333" }}
                        >
                          {STATUS_OPTIONS.filter(s => s !== 'cancelled').map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <button className="ao-expand-btn" onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}>
                        <i className={`fa-solid fa-chevron-${expandedId === order._id ? "up" : "down"}`}></i>
                      </button>
                    </td>
                  </tr>

                  {expandedId === order._id && (
                    <tr className="ao-detail-row">
                      <td colSpan={10}>
                        <div className="ao-detail-panel">
                          <div className="ao-detail-grid">

                            {/* Products */}
                            <div className="ao-detail-section ao-detail-products">
                              <h4><i className="fa-solid fa-box"></i> Products</h4>
                              {order.products?.map((p, i) => (
                                <div key={i} className="ao-product-row">
                                  <img src={`${import.meta.env.VITE_API_IMAGE}/${p.frontImg}`} alt={p.title} />
                                  <div>
                                    <p>{p.title}</p>
                                    <span>Qty: {p.quantity} · ₹{p.price} each</span>
                                  </div>
                                  <strong>₹{p.itemTotal || p.price * p.quantity}</strong>
                                </div>
                              ))}
                            </div>

                            {/* Shipping */}
                            <div className="ao-detail-section">
                              <h4><i className="fa-solid fa-location-dot"></i> Shipping Address</h4>
                              <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                              <p>{order.shippingAddress?.address}{order.shippingAddress?.apartment ? ", " + order.shippingAddress.apartment : ""}</p>
                              <p>{order.shippingAddress?.city}{order.shippingAddress?.district ? ", " + order.shippingAddress.district : ""}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}</p>
                              <p>{order.shippingAddress?.country}</p>
                              <p>Phone: {order.customerInfo?.phone || "—"}</p>
                            </div>

                            {/* Payment */}
                            <div className="ao-detail-section">
                              <h4><i className="fa-solid fa-credit-card"></i> Payment Info</h4>
                              <p>Method: <strong>{order.paymentInfo?.method?.toUpperCase()}</strong></p>
                              <p>Status: <strong style={{ color: order.paymentInfo?.status === "completed" ? "#10b981" : "#ef4444" }}>{order.paymentInfo?.status}</strong></p>
                              {order.paymentInfo?.razorpayOrderId && <p className="ao-small">Razorpay Order: {order.paymentInfo.razorpayOrderId}</p>}
                              {order.paymentInfo?.razorpayPaymentId && <p className="ao-small">Payment ID: {order.paymentInfo.razorpayPaymentId}</p>}
                              <hr />
                              <p>Subtotal: ₹{order.subtotal}</p>
                              <p>Shipping: {order.shippingCost === 0 ? "FREE" : "₹" + order.shippingCost}</p>
                              <p><strong>Total: ₹{order.total}</strong></p>
                            </div>

                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
