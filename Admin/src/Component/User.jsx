import React, { useEffect, useState } from "react";
import axios from "axios";
import "./User.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric"
    });
  };

  const getStatusBadge = (user) => {
    if (!user.isActive) return <span className="status-badge inactive">Inactive</span>;
    if (!user.isVerified) return <span className="status-badge unverified">Unverified</span>;
    return <span className="status-badge verified">Verified</span>;
  };

  const getDOB = (user) => {
    if (!user.birthDD && !user.birthMM && !user.birthYYYY) return "N/A";
    return `${user.birthDD || "--"}/${user.birthMM || "--"}/${user.birthYYYY || "----"}`;
  };

  const getAddress = (addr) => {
    if (!addr) return "N/A";
    const parts = [addr.street, addr.addressLine2, addr.city, addr.district, addr.state, addr.zipCode, addr.country];
    const filled = parts.filter(Boolean);
    return filled.length ? filled.join(", ") : "N/A";
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  if (loading) {
    return (
      <div className="user-container">
        <div className="loading-spinner">
          <i className="fa-solid fa-spinner fa-spin"></i> Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="user-header">
        <h2><i className="fa-solid fa-users"></i> User Management</h2>
        <div className="user-header-right">
          <input
            className="user-search"
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="user-count">Total: <strong>{users.length}</strong></div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-user-slash"></i>
          <p>No users found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, index) => (
                <React.Fragment key={user._id}>
                  <tr className={expandedUser === user._id ? "row-expanded" : ""}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="user-name">
                        <div className="user-avatar">
                          {user.avatar
                            ? <img src={user.avatar} alt={user.name} />
                            : <span>{user.name?.[0]?.toUpperCase() || "U"}</span>
                          }
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td>{user.gender || "N/A"}</td>
                    <td>{getStatusBadge(user)}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.lastLogin)}</td>
                    <td>
                      <button
                        className="expand-btn"
                        onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                      >
                        <i className={`fa-solid fa-chevron-${expandedUser === user._id ? "up" : "down"}`}></i>
                      </button>
                    </td>
                  </tr>

                  {expandedUser === user._id && (
                    <tr className="detail-row">
                      <td colSpan={9}>
                        <div className="user-detail-panel">
                          <div className="detail-grid">

                            <div className="detail-section">
                              <h4><i className="fa-solid fa-circle-info"></i> Personal Info</h4>
                              <div className="detail-item"><span>Full Name</span><strong>{user.name}</strong></div>
                              <div className="detail-item"><span>Email</span><strong>{user.email}</strong></div>
                              <div className="detail-item"><span>Phone</span><strong>{user.phone || "N/A"}</strong></div>
                              <div className="detail-item"><span>Gender</span><strong>{user.gender || "N/A"}</strong></div>
                              <div className="detail-item"><span>Date of Birth</span><strong>{getDOB(user)}</strong></div>
                            </div>

                            <div className="detail-section">
                              <h4><i className="fa-solid fa-location-dot"></i> Address</h4>
                              <div className="detail-item"><span>Street</span><strong>{user.address?.street || "N/A"}</strong></div>
                              <div className="detail-item"><span>City</span><strong>{user.address?.city || "N/A"}</strong></div>
                              <div className="detail-item"><span>State</span><strong>{user.address?.state || "N/A"}</strong></div>
                              <div className="detail-item"><span>PIN Code</span><strong>{user.address?.zipCode || "N/A"}</strong></div>
                              <div className="detail-item"><span>Country</span><strong>{user.address?.country || "N/A"}</strong></div>
                            </div>

                            <div className="detail-section">
                              <h4><i className="fa-solid fa-shield-halved"></i> Account Info</h4>
                              <div className="detail-item"><span>Status</span><strong>{user.accountStatus}</strong></div>
                              <div className="detail-item"><span>Verified</span><strong>{user.isVerified ? "Yes" : "No"}</strong></div>
                              <div className="detail-item"><span>Active</span><strong>{user.isActive ? "Yes" : "No"}</strong></div>
                              <div className="detail-item"><span>Joined</span><strong>{formatDate(user.createdAt)}</strong></div>
                              <div className="detail-item"><span>Last Login</span><strong>{formatDate(user.lastLogin)}</strong></div>
                            </div>

                            <div className="detail-section">
                              <h4><i className="fa-solid fa-bag-shopping"></i> Activity</h4>
                              <div className="detail-item"><span>Total Orders</span><strong>{user.orderCount || 0}</strong></div>
                              <div className="detail-item"><span>Wishlist Items</span><strong>{user.wishlist?.length || 0}</strong></div>
                              <div className="detail-item"><span>Cart Items</span><strong>{user.cart?.length || 0}</strong></div>
                              <div className="detail-item"><span>Newsletter</span><strong>{user.preferences?.newsletter ? "Subscribed" : "No"}</strong></div>
                              <div className="detail-item"><span>Notifications</span><strong>{user.preferences?.notifications ? "On" : "Off"}</strong></div>
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

export default User;
