import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import {
  BarChart,
  LineChart,
  AreaChart,
  Area,
  Line,
  Cell,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend
} from "recharts";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0,
    revenue: 0
  });

  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [salesType, setSalesType] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [siteStats, setSiteStats] = useState({ searches: 0, productClicks: 0, addToCart: 0 });

  // ================= Fetch Dashboard Data =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes, usersRes, ordersRes, statsRes] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/products`),
            axios.get(`${import.meta.env.VITE_API_URL}/categories`),
            axios.get(`${import.meta.env.VITE_API_URL}/users`),
            axios.get(`${import.meta.env.VITE_API_URL}/orders/all`),
            axios.get(`${import.meta.env.VITE_API_URL}/stats`),
          ]);

        const allOrders = ordersRes.data.orders || [];
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        setCounts({
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          users: usersRes.data.length,
          orders: allOrders.length,
          revenue: totalRevenue
        });

        setAllOrders(allOrders);
        setAllProducts(productsRes.data || []);
        setOrders(allOrders.slice(0, 5));
        setSiteStats({
          searches: statsRes.data.searches || 0,
          productClicks: statsRes.data.productClicks || 0,
          addToCart: statsRes.data.addToCart || 0,
        });

        // Get low stock products (stock < 10)
        const lowStock = productsRes.data
          .filter(p => p.stock < 10)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);
        setLowStockProducts(lowStock);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ================= Animated Counter =================
  const AnimatedNumber = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 800;
      const increment = value / (duration / 16);

      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, [value]);

    return <h2>{count}</h2>;
  };

  // ================= Profit & Loss Data =================
  const [plType, setPlType] = useState("monthly");

  const profitLossData = React.useMemo(() => {
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const today = new Date();
    const currentYear = today.getFullYear();

    // Daily — last 7 days
    const dailyMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { name: DAYS[d.getDay()], profit: 0, loss: 0 };
    }

    // Monthly — current year
    const monthlyMap = MONTHS.map((name) => ({ name, profit: 0, loss: 0 }));

    // Yearly
    const yearlyMap = {};

    allOrders.forEach(o => {
      const amount = o.total || 0;
      const isProfit = o.status !== 'cancelled';
      const d = new Date(o.createdAt);
      const dayKey = d.toISOString().slice(0, 10);
      const yr = String(d.getFullYear());

      if (dailyMap[dayKey]) {
        if (isProfit) dailyMap[dayKey].profit += amount;
        else dailyMap[dayKey].loss += amount;
      }

      if (d.getFullYear() === currentYear) {
        if (isProfit) monthlyMap[d.getMonth()].profit += amount;
        else monthlyMap[d.getMonth()].loss += amount;
      }

      if (!yearlyMap[yr]) yearlyMap[yr] = { name: yr, profit: 0, loss: 0 };
      if (isProfit) yearlyMap[yr].profit += amount;
      else yearlyMap[yr].loss += amount;
    });

    const yearlyData = Object.values(yearlyMap).sort((a, b) => a.name - b.name);

    return {
      daily: Object.values(dailyMap),
      monthly: monthlyMap,
      yearly: yearlyData.length ? yearlyData : [{ name: String(currentYear), profit: 0, loss: 0 }],
    };
  }, [allOrders]);

  // ================= Order Comparison Data =================
  const [orderPeriod, setOrderPeriod] = useState("this-week-vs-last-week");
  const [customFrom1, setCustomFrom1] = useState(() => new Date().toISOString().slice(0, 10));
  const [customTo1,   setCustomTo1]   = useState(() => new Date().toISOString().slice(0, 10));
  const [customFrom2, setCustomFrom2] = useState(() => new Date().toISOString().slice(0, 10));
  const [customTo2,   setCustomTo2]   = useState(() => new Date().toISOString().slice(0, 10));

  const orderChartData = React.useMemo(() => {
    const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const today  = new Date();
    today.setHours(0,0,0,0);

    // Use local date string to avoid UTC timezone shift
    const fmtLocal = (d) => {
      const dd = new Date(d);
      return `${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}-${String(dd.getDate()).padStart(2,'0')}`;
    };

    const countInRange = (fromStr, toStr) => {
      // Parse as local date (avoid UTC shift)
      const [fy,fm,fd] = fromStr.split('-').map(Number);
      const [ty,tm,td] = toStr.split('-').map(Number);
      const f = new Date(fy, fm-1, fd, 0, 0, 0, 0);
      const t = new Date(ty, tm-1, td, 23, 59, 59, 999);
      const days = Math.round((t - f) / 86400000) + 1;
      const map  = Array.from({ length: days }, (_, i) => {
        const d = new Date(f); d.setDate(f.getDate() + i);
        return { name: days <= 14 ? DAYS[d.getDay()] : `${d.getDate()} ${MONTHS[d.getMonth()]}`, count: 0 };
      });
      allOrders.forEach(o => {
        const d = new Date(o.createdAt);
        if (d >= f && d <= t) {
          const idx = Math.floor((d - f) / 86400000);
          if (map[idx]) map[idx].count += 1;
        }
      });
      return map;
    };

    // Week helpers using local dates
    const startOfWeek = (d) => { const x = new Date(d); x.setDate(d.getDate() - d.getDay()); x.setHours(0,0,0,0); return x; };
    const endOfWeek   = (d) => { const x = new Date(d); x.setDate(d.getDate() - d.getDay() + 6); x.setHours(0,0,0,0); return x; };

    const thisWeekS  = startOfWeek(today);
    const thisWeekE  = endOfWeek(today);
    const lastWeekS  = new Date(thisWeekS); lastWeekS.setDate(thisWeekS.getDate() - 7);
    const lastWeekE  = new Date(thisWeekE); lastWeekE.setDate(thisWeekE.getDate() - 7);

    const thisMonthS = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthE = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthS = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthE = new Date(today.getFullYear(), today.getMonth(), 0);

    // For year view — monthly buckets
    const monthlyBuckets = (year) => {
      return MONTHS.map((name, i) => {
        const ms = new Date(year, i, 1, 0, 0, 0, 0);
        const me = new Date(year, i + 1, 0, 23, 59, 59, 999);
        const count = allOrders.filter(o => { const d = new Date(o.createdAt); return d >= ms && d <= me; }).length;
        return { name, count };
      });
    };

    const periods = {
      "this-week-vs-last-week": {
        labelA: "This Week", labelB: "Last Week",
        dataA: countInRange(fmtLocal(thisWeekS), fmtLocal(thisWeekE)),
        dataB: countInRange(fmtLocal(lastWeekS), fmtLocal(lastWeekE)),
      },
      "this-month-vs-last-month": {
        labelA: "This Month", labelB: "Last Month",
        dataA: countInRange(fmtLocal(thisMonthS), fmtLocal(thisMonthE)),
        dataB: countInRange(fmtLocal(lastMonthS), fmtLocal(lastMonthE)),
      },
      "this-year-vs-last-year": {
        labelA: String(today.getFullYear()), labelB: String(today.getFullYear() - 1),
        dataA: monthlyBuckets(today.getFullYear()),
        dataB: monthlyBuckets(today.getFullYear() - 1),
      },
      "custom": {
        labelA: `${customFrom1} → ${customTo1}`,
        labelB: `${customFrom2} → ${customTo2}`,
        dataA: countInRange(customFrom1, customTo1),
        dataB: countInRange(customFrom2, customTo2),
      },
    };

    const p = periods[orderPeriod] || periods["this-week-vs-last-week"];
    const len = Math.max(p.dataA.length, p.dataB.length);
    return {
      labelA: p.labelA,
      labelB: p.labelB,
      totalA: p.dataA.reduce((s, d) => s + d.count, 0),
      totalB: p.dataB.reduce((s, d) => s + d.count, 0),
      rows: Array.from({ length: len }, (_, i) => ({
        name:  (p.dataA[i] || p.dataB[i])?.name || "",
        countA: p.dataA[i]?.count || 0,
        countB: p.dataB[i]?.count || 0,
      })),
    };
  }, [allOrders, orderPeriod, customFrom1, customTo1, customFrom2, customTo2]);

  // ================= Bar Chart Data =================
  const data = [
    { name: "Products", value: counts.products, color: "#667eea" },
    { name: "Categories", value: counts.categories, color: "#38ef7d" },
    { name: "Users", value: counts.users, color: "#f7971e" },
  ];

  // ================= Sales Data (real from orders) =================
  const salesData = React.useMemo(() => {
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    // Daily — last 7 days
    const dailyMap = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { name: DAYS[d.getDay()], revenue: 0, orders: 0 };
    }
    allOrders.forEach(o => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (dailyMap[key]) {
        dailyMap[key].revenue += o.total || 0;
        dailyMap[key].orders += 1;
      }
    });

    // Monthly — current year
    const currentYear = new Date().getFullYear();
    const monthlyMap = MONTHS.map((name, i) => ({ name, revenue: 0, orders: 0, month: i }));
    allOrders.forEach(o => {
      const d = new Date(o.createdAt);
      if (d.getFullYear() === currentYear) {
        monthlyMap[d.getMonth()].revenue += o.total || 0;
        monthlyMap[d.getMonth()].orders += 1;
      }
    });

    // Yearly — all years present in orders
    const yearlyMap = {};
    allOrders.forEach(o => {
      const yr = String(new Date(o.createdAt).getFullYear());
      if (!yearlyMap[yr]) yearlyMap[yr] = { name: yr, revenue: 0, orders: 0 };
      yearlyMap[yr].revenue += o.total || 0;
      yearlyMap[yr].orders += 1;
    });
    const yearlyData = Object.values(yearlyMap).sort((a, b) => a.name - b.name);

    return {
      daily: Object.values(dailyMap),
      monthly: monthlyMap,
      yearly: yearlyData.length ? yearlyData : [{ name: String(currentYear), revenue: 0, orders: 0 }],
    };
  }, [allOrders]);

  // ================= Top Selling Categories (from orders) =================
  const topCategoriesData = React.useMemo(() => {
    const COLORS = ['#4361ee','#f72585','#4cc9f0','#f7971e','#38ef7d','#7209b7','#ff6b6b'];
    const catCount = {};

    allOrders.forEach(order => {
      (order.products || []).forEach(p => {
        // match productId to get category
        const product = allProducts.find(pr =>
          pr._id === (p.productId?._id || p.productId)
        );
        const catName = product?.category?.name || p.title?.split(' ')[0] || 'Other';
        catCount[catName] = (catCount[catName] || 0) + (p.quantity || 1);
      });
    });

    return Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], i) => ({ name, value, color: COLORS[i] }));
  }, [allOrders, allProducts]);

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    const statusMap = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <i className="fa-solid fa-spinner fa-spin"></i>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>
          <i className="fa-solid fa-chart-line"></i> Dashboard Overview
        </h2>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="stats-grid">
        <div className="stat-card stat-orders">
          <div className="stat-icon">
            <i className="fa-solid fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h4>Total Orders</h4>
            <AnimatedNumber value={counts.orders} />
            <span className="stat-label">All time orders</span>
          </div>
        </div>

        <div className="stat-card stat-products">
          <div className="stat-icon">
            <i className="fa-solid fa-box"></i>
          </div>
          <div className="stat-content">
            <h4>Total Products</h4>
            <AnimatedNumber value={counts.products} />
            <span className="stat-label">In inventory</span>
          </div>
        </div>

        <div className="stat-card stat-users">
          <div className="stat-icon">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="stat-content">
            <h4>Total Users</h4>
            <AnimatedNumber value={counts.users} />
            <span className="stat-label">Registered users</span>
          </div>
        </div>

        <div className="stat-card stat-revenue">
          <div className="stat-icon">
            <i className="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <div className="stat-content">
            <h4>Total Revenue</h4>
            <h2>{formatCurrency(counts.revenue)}</h2>
            <span className="stat-label">All time revenue</span>
          </div>
        </div>
      </div>

      {/* ===== Profit & Loss Chart ===== */}
      <div className="pl-chart-card">
        <div className="chart-header">
          <h3><i className="fa-solid fa-scale-balanced"></i> Profit &amp; Loss Overview</h3>
          <div className="chart-toggle">
            {["daily", "monthly", "yearly"].map((type) => (
              <button key={type} onClick={() => setPlType(type)} className={plType === type ? "active" : ""}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary pills */}
        <div className="pl-summary">
          <div className="pl-pill pl-profit-pill">
            <i className="fa-solid fa-arrow-trend-up"></i>
            <span>Total Profit</span>
            <strong>{formatCurrency(profitLossData[plType].reduce((s, d) => s + d.profit, 0))}</strong>
          </div>
          <div className="pl-pill pl-loss-pill">
            <i className="fa-solid fa-arrow-trend-down"></i>
            <span>Total Loss</span>
            <strong>{formatCurrency(profitLossData[plType].reduce((s, d) => s + d.loss, 0))}</strong>
          </div>
          <div className="pl-pill pl-net-pill">
            <i className="fa-solid fa-equals"></i>
            <span>Net</span>
            <strong>{formatCurrency(
              profitLossData[plType].reduce((s, d) => s + d.profit - d.loss, 0)
            )}</strong>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={profitLossData[plType]} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis tickFormatter={(v) => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value, name) => [formatCurrency(value), name === 'profit' ? 'Profit' : 'Loss']} />
            <Legend formatter={(value) => value === 'profit' ? 'Profit' : 'Loss'} />
            <Area type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2.5} fill="url(#profitGrad)" dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 7 }} />
            <Area type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2.5} fill="url(#lossGrad)" dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 7 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Order Comparison Chart ===== */}
      <div className="pl-chart-card">

        {/* Header row */}
        <div className="oc-header">
          <div className="oc-title">
            <i className="fa-solid fa-cart-shopping"></i>
            <div>
              <h3>Orders Comparison</h3>
              <p>Compare order counts across two time periods</p>
            </div>
          </div>

          {/* Period selector dropdown */}
          <div className="oc-select-wrap">
            <i className="fa-solid fa-calendar-days oc-select-icon"></i>
            <select value={orderPeriod} onChange={e => setOrderPeriod(e.target.value)} className="oc-select">
              <option value="this-week-vs-last-week">This Week vs Last Week</option>
              <option value="this-month-vs-last-month">This Month vs Last Month</option>
              <option value="this-year-vs-last-year">This Year vs Last Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
        </div>

        {/* Custom date pickers */}
        {orderPeriod === "custom" && (
          <div className="order-custom-dates">
            <div className="order-date-group">
              <label><i className="fa-solid fa-circle" style={{color:'#4361ee',fontSize:8}}></i> Period A</label>
              <div className="order-date-inputs">
                <input type="date" value={customFrom1} max={customTo1}   onChange={e => setCustomFrom1(e.target.value)} />
                <span>to</span>
                <input type="date" value={customTo1}   min={customFrom1} onChange={e => setCustomTo1(e.target.value)} />
              </div>
            </div>
            <div className="order-date-group">
              <label><i className="fa-solid fa-circle" style={{color:'#a855f7',fontSize:8}}></i> Period B</label>
              <div className="order-date-inputs">
                <input type="date" value={customFrom2} max={customTo2}   onChange={e => setCustomFrom2(e.target.value)} />
                <span>to</span>
                <input type="date" value={customTo2}   min={customFrom2} onChange={e => setCustomTo2(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Summary pills */}
        <div className="oc-pills">
          <div className="oc-pill oc-pill-a">
            <div className="oc-pill-dot" style={{background:'#4361ee'}}></div>
            <div>
              <div className="oc-pill-label">{orderChartData.labelA}</div>
              <div className="oc-pill-count">{orderChartData.totalA} <span>orders</span></div>
            </div>
          </div>
          <div className="oc-pill-vs">VS</div>
          <div className="oc-pill oc-pill-b">
            <div className="oc-pill-dot" style={{background:'#a855f7'}}></div>
            <div>
              <div className="oc-pill-label">{orderChartData.labelB}</div>
              <div className="oc-pill-count">{orderChartData.totalB} <span>orders</span></div>
            </div>
          </div>
          <div className="oc-pill-diff">
            {orderChartData.totalA >= orderChartData.totalB
              ? <><i className="fa-solid fa-arrow-trend-up" style={{color:'#22c55e'}}></i> +{orderChartData.totalA - orderChartData.totalB} more</>
              : <><i className="fa-solid fa-arrow-trend-down" style={{color:'#ef4444'}}></i> {orderChartData.totalA - orderChartData.totalB} less</>
            }
            <span> than previous</span>
          </div>
        </div>

        {/* Bar chart */}
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={orderChartData.rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap="25%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false}
              interval={orderPeriod === "this-month-vs-last-month" ? 2 : 0} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(67,97,238,0.05)' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13 }}
              formatter={(value, name) => [`${value} orders`, name === "countA" ? orderChartData.labelA : orderChartData.labelB]}
            />
            <Legend formatter={name => name === "countA" ? orderChartData.labelA : orderChartData.labelB} />
            <Bar dataKey="countA" name="countA" fill="#4361ee" radius={[6,6,0,0]} maxBarSize={36} />
            <Bar dataKey="countB" name="countB" fill="#c4b5fd" radius={[6,6,0,0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Charts Row — 2 columns only ===== */}
      <div className="charts-row">
        {/* System Overview Chart */}
        <div className="chart-card">
          <h3><i className="fa-solid fa-chart-bar"></i> System Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Overview Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3><i className="fa-solid fa-chart-line"></i> Sales Overview</h3>
            <div className="chart-toggle">
              {["daily", "monthly", "yearly"].map((type) => (
                <button key={type} onClick={() => setSalesType(type)} className={salesType === type ? "active" : ""}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData[salesType]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `₹${value.toFixed(2)}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="revenue" stroke="#4361ee" strokeWidth={3} dot={{ r: 4, fill: "#4361ee" }} activeDot={{ r: 7 }} />
              <Line yAxisId="right" type="monotone" dataKey="orders" name="orders" stroke="#38ef7d" strokeWidth={2} dot={{ r: 3, fill: "#38ef7d" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Categories Donut — moved to tables row below */}
      </div>

      {/* ===== Tables Row ===== */}
      <div className="tables-row">

        {/* Site Activity Card */}
        {(() => {
          const cancelledOrders = allOrders.filter(o => o.status === 'cancelled').length;
          const total = (siteStats.searches + siteStats.productClicks + cancelledOrders) || 1;
          const stats = [
            { label: 'Search Volume',    value: siteStats.searches,     color: '#4361ee', bg: '#eff6ff', icon: 'fa-magnifying-glass' },
            { label: 'Product Clicks',   value: siteStats.productClicks, color: '#f7971e', bg: '#fff7ed', icon: 'fa-arrow-pointer'    },
            { label: 'Cancelled Orders', value: cancelledOrders,         color: '#ef4444', bg: '#fef2f2', icon: 'fa-ban'              },
          ];
          return (
            <div className="table-card">
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:8}}>
                <h3 style={{margin:0}}><i className="fa-solid fa-chart-simple" style={{color:'#4361ee'}}></i> Site Activity</h3>
                <span style={{fontSize:12,color:'#9ca3af',background:'#f3f4f6',padding:'4px 10px',borderRadius:20, whiteSpace:'nowrap'}}>
                  Total: {total.toLocaleString('en-IN')} interactions
                </span>
              </div>

              <div style={{display:'flex', flexDirection:'column', gap:20}}>
                {stats.map(s => {
                  const pct = Math.round((s.value / total) * 100);
                  return (
                    <div key={s.label}>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexWrap:'wrap', gap:4}}>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                          <div style={{width:34,height:34,borderRadius:8,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <i className={`fa-solid ${s.icon}`} style={{color:s.color,fontSize:14}}></i>
                          </div>
                          <span style={{fontSize:14,fontWeight:600,color:'#374151'}}>{s.label}</span>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:8, flexShrink:0, minWidth:0}}>
                          <span style={{fontSize:16,fontWeight:800,color:'#1a1a2e'}}>{s.value.toLocaleString('en-IN')}</span>
                          <span style={{fontSize:11,color:'#fff',background:s.color,padding:'2px 6px',borderRadius:20,fontWeight:600,whiteSpace:'nowrap',flexShrink:0}}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{height:8,background:'#f3f4f6',borderRadius:99,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${pct}%`,background:s.color,borderRadius:99,transition:'width 0.6s ease'}}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Top Selling Categories Donut */}
        <div className="table-card">
          <h3><i className="fa-solid fa-chart-pie"></i> Top Selling Categories</h3>
          {topCategoriesData.length === 0 ? (
            <div className="empty-table"><i className="fa-solid fa-inbox"></i><p>No order data yet</p></div>
          ) : (
            <div className="top-categories-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={topCategoriesData} cx="50%" cy="45%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {topCategoriesData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value + ' sold', name]} />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        {/* Recent Orders */}
        <div className="table-card">
          <h3>
            <i className="fa-solid fa-clock-rotate-left"></i> Recent Orders
          </h3>
          {orders.length === 0 ? (
            <div className="empty-table">
              <i className="fa-solid fa-inbox"></i>
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-number">{order.orderNumber}</td>
                      <td>{order.customerInfo?.firstName || 'N/A'} {order.customerInfo?.lastName || ''}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td className="order-total">{formatCurrency(order.total)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="table-card">
          <h3>
            <i className="fa-solid fa-triangle-exclamation"></i> Low Stock Alert
          </h3>
          {lowStockProducts.length === 0 ? (
            <div className="empty-table">
              <i className="fa-solid fa-check-circle"></i>
              <p>All products in stock</p>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="product-cell">
                          <img 
                            src={`${import.meta.env.VITE_API_IMAGE}/${product.frontImg}`} 
                            alt={product.title}
                            className="product-thumb"
                          />
                          <span>{product.title}</span>
                        </div>
                      </td>
                      <td>{product.category?.name || 'N/A'}</td>
                      <td className="stock-count">{product.stock} units</td>
                      <td>
                        <span className={`stock-badge ${product.stock < 5 ? 'critical' : 'low'}`}>
                          {product.stock < 5 ? 'Critical' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
