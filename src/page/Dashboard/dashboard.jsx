import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/style/main.css";
import Sidebar from "../../components/Sidebar";
import { getTables } from "../../api/tableApi";
import { getOrdersAnalytics } from "../../api/orderApi";
import { getProductsSummary } from "../../api/productApi";

import { Search, Sun, Moon } from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [chartMode, setChartMode] = useState("month");
  const [orderStats, setOrderStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    loadedOrders: 0,
    isLoaded: false,
  });
  const [hourlyData, setHourlyData] = useState(
    Array.from({ length: 24 }, (_, hour) => ({
      name: `${String(hour).padStart(2, "0")}:00`,
      value: 0,
    }))
  );
  const [tableStats, setTableStats] = useState({
    available: 0,
    total: 0,
    isLoaded: false,
  });
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    loadedProducts: 0,
    isLoaded: false,
  });

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const analytics = await getOrdersAnalytics(chartMode);
        if (isMounted) {
          setOrderStats({
            totalRevenue: analytics.totalRevenue,
            totalOrders: analytics.totalOrders,
            loadedOrders: analytics.loadedOrders,
            isLoaded: true,
          });
          setHourlyData(analytics.chartData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thống kê đơn hàng:", error);
        if (isMounted) {
          setOrderStats((prev) => ({ ...prev, isLoaded: true }));
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [chartMode]);

  useEffect(() => {
    let isMounted = true;

    const loadTables = async () => {
      try {
        const tables = await getTables();
        const available = tables.filter((table) => {
          const status = String(table?.status || "").toLowerCase();
          return status === "available" || status === "trống";
        }).length;

        if (isMounted) {
          setTableStats({
            available,
            total: tables.length,
            isLoaded: true,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thống kê bàn:", error);
        if (isMounted) {
          setTableStats((prev) => ({ ...prev, isLoaded: true }));
        }
      }
    };

    const loadProducts = async () => {
      try {
        const summary = await getProductsSummary();
        if (isMounted) {
          setProductStats({ ...summary, isLoaded: true });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thống kê món:", error);
        if (isMounted) {
          setProductStats((prev) => ({ ...prev, isLoaded: true }));
        }
      }
    };

    loadTables();
    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(value || 0));
  };

  const currentDateLabel = useMemo(() => {
    const now = new Date();
    return `Báo cáo tình hình kinh doanh hôm nay, ${now.getDate()} Tháng ${now.getMonth() + 1
      }, ${now.getFullYear()}`;
  }, []);

  const pieData = [
    { name: "Phở Bò", value: 50, color: "#04612A" },
    { name: "Bún Chả", value: 25, color: "#2D8A4E" },
    { name: "Đồ Uống", value: 20, color: "#74C38D" },
    { name: "Khác", value: 5, color: "#D1E7D1" },
  ];

  const stats = useMemo(() => [
    {
      label: "Doanh thu hôm nay",
      val: formatCurrency(orderStats.totalRevenue),
      trend: orderStats.isLoaded
        ? `Đã tổng hợp ${orderStats.loadedOrders} đơn từ tất cả trang`
        : "Đang tải...",
      sub: "VNĐ",
    },
    {
      label: "Tổng đơn hàng",
      val: String(orderStats.totalOrders),
      trend: orderStats.isLoaded ? "Cập nhật từ API" : "Đang tải...",
      sub: "Đơn",
    },
    { label: "Khách phục vụ", val: "45", trend: "Tăng", sub: "Người" },
    {
      label: "Số bàn trống",
      val: String(tableStats.available).padStart(2, "0"),
      trend: tableStats.isLoaded
        ? `${tableStats.available}/${tableStats.total} bàn đang trống`
        : "Đang tải...",
      sub: "Bàn",
    },
  ], [
    orderStats.totalRevenue,
    orderStats.loadedOrders,
    orderStats.totalOrders,
    orderStats.isLoaded,
    tableStats.available,
    tableStats.total,
    tableStats.isLoaded,
  ]);

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar />

      <div className="main-content p-4">
        <nav className="d-flex justify-content-between align-items-center mb-5">
          <div
            className="search-bar bg-white px-3 py-2 rounded-pill shadow-sm d-flex align-items-center"
            style={{ width: "400px" }}
          >
            <Search size={18} className="text-secondary me-2" />
            <input
              type="text"
              placeholder="Tìm kiếm dữ liệu..."
              className="border-0 w-100"
              style={{ outline: "none" }}
            />
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-light rounded-circle p-2 shadow-sm"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div
              className="rounded-circle bg-secondary"
              style={{ width: "40px", height: "40px" }}
            ></div>
          </div>
        </nav>

        <main>
          <header className="mb-4">
            <h2 className="fw-bold">Xin chào Quản lý</h2>
            <p className="text-muted">{currentDateLabel}</p>
          </header>

          <div className="row g-4 mb-5">
            {stats.map((item, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-3">
                <div className="dashboard-card bg-white h-100">
                  <span className="text-muted small">{item.label}</span>
                  <div className="d-flex align-items-baseline gap-2 my-2">
                    <h3 className="fw-bold mb-0">{item.val}</h3>
                    <small className="text-muted">{item.sub}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-12 col-xl-8">
              <div className="dashboard-card bg-white">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">
                    {chartMode === "month"
                      ? "Biểu đồ doanh thu theo ngày trong tháng"
                      : "Biểu đồ doanh thu theo giờ"}
                  </h5>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "170px" }}
                    value={chartMode}
                    onChange={(e) => setChartMode(e.target.value)}
                  >
                    <option value="day">Theo ngày</option>
                    <option value="month">Theo tháng</option>
                  </select>
                </div>
                <div style={{ height: "350px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#eee"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "#f8f9fa" }} />
                      <Bar
                        dataKey="value"
                        fill="var(--primary-dine)"
                        radius={[8, 8, 0, 0]}
                        barSize={45}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="dashboard-card bg-white">
                <h5 className="fw-bold mb-4">Tỷ lệ món ăn</h5>
                <div style={{ height: "350px", position: "relative" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                    }}
                  >
                    <div className="fs-3 fw-bold">
                      {productStats.isLoaded ? productStats.totalProducts : "..."}
                    </div>
                    <div className="small text-muted">TỔNG MÓN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
