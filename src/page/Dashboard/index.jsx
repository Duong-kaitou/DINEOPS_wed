import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/logo.svg";

import {
  LayoutDashboard,
  Utensils,
  Receipt,
  Users,
  Search,
  Sun,
  Moon,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("Tổng quan");

  const PRIMARY_COLOR = "#04612A";
  const LIGHT_BG = "#F4F7F5";
  const SIDEBAR_WIDTH = "280px";

  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan" },
    { icon: Utensils, label: "Thực đơn" },
    { icon: Receipt, label: "Đơn hàng" },
    { icon: Users, label: "Nhân sự" },
    { icon: BarChart3, label: "Báo cáo" },
  ];

  const hourlyData = [
    { name: "08:00", value: 1.2 },
    { name: "10:00", value: 2.5 },
    { name: "12:00", value: 4.5 },
    { name: "14:00", value: 7.0 },
    { name: "16:00", value: 9.5 },
    { name: "18:00", value: 8.0 },
    { name: "20:00", value: 5.5 },
    { name: "22:00", value: 3.5 },
  ];

  const pieData = [
    { name: "Phở Bò", value: 50, color: "#04612A" },
    { name: "Bún Chả", value: 25, color: "#2D8A4E" },
    { name: "Đồ Uống", value: 20, color: "#74C38D" },
    { name: "Khác", value: 5, color: "#D1E7D1" },
  ];

  const cardStyle = {
    backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF",
    borderRadius: "20px",
    border: "none",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    padding: "30px",
  };

  return (
    <div
      className={`d-flex ${darkMode ? "bg-dark text-light" : ""}`}
      style={{
        minHeight: "100vh",
        transition: "all 0.3s",
        backgroundColor: darkMode ? "#121212" : LIGHT_BG,
      }}
    >
      <aside
        className={`d-flex flex-column flex-shrink-0 p-4 ${
          darkMode ? "bg-dark border-secondary" : "bg-white shadow-sm"
        }`}
        style={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          position: "fixed",
          borderRight: "1px solid #eee",
          zIndex: 1000,
        }}
      >
        <div className="d-flex align-items-center gap-3 mb-5 px-2">
          <div
            className="bg-white border shadow-sm rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: 45, height: 45 }}
          >
            <img src={logo} alt="Logo" style={{ width: 25, height: 25 }} />
          </div>
          <span
            className="fw-bold fs-4"
            style={{
              color: darkMode ? "#fff" : PRIMARY_COLOR,
              letterSpacing: "-0.8px",
            }}
          >
            DINEOPS
          </span>
        </div>

        <ul className="nav nav-pills flex-column mb-auto gap-2">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <button
                onClick={() => setActiveTab(item.label)}
                className={`nav-link w-100 d-flex align-items-center gap-3 px-3 py-3 rounded-4 border-0 transition-all ${
                  activeTab === item.label
                    ? "active shadow-sm"
                    : "text-secondary bg-transparent"
                }`}
                style={{
                  backgroundColor:
                    activeTab === item.label ? PRIMARY_COLOR : "transparent",
                  color: activeTab === item.label ? "#fff" : "",
                  textAlign: "left",
                }}
              >
                <item.icon
                  size={22}
                  strokeWidth={activeTab === item.label ? 2.5 : 2}
                />
                <span className="fw-bold">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <hr className={darkMode ? "border-secondary" : ""} />

        <div className="d-flex flex-column gap-2 px-2">
          <button className="btn d-flex align-items-center gap-3 text-secondary p-2 border-0 bg-transparent">
            <Settings size={20} /> <span>Cài đặt</span>
          </button>
          <button className="btn d-flex align-items-center gap-3 text-danger p-2 border-0 bg-transparent">
            <LogOut size={20} /> <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div
        style={{
          marginLeft: SIDEBAR_WIDTH,
          width: `calc(100% - ${SIDEBAR_WIDTH})`,
        }}
      >
        <nav
          className={`navbar sticky-top px-5 py-3 ${
            darkMode ? "bg-dark border-secondary" : "bg-white shadow-sm"
          }`}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <div className="container-fluid">
            <div
              className="d-flex align-items-center bg-light px-3 py-2 rounded-4"
              style={{ width: "400px" }}
            >
              <Search size={18} className="text-secondary me-2" />
              <input
                type="text"
                placeholder="Tìm kiếm dữ liệu..."
                className="bg-transparent border-0 w-100 outline-none"
                style={{ outline: "none" }}
              />
            </div>

            <div className="d-flex align-items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="btn p-2 rounded-circle border-0 bg-light text-dark shadow-sm"
              >
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
              </button>
              <div
                className="rounded-circle border"
                style={{
                  width: 45,
                  height: 45,
                  borderColor: PRIMARY_COLOR,
                  borderWidth: 2,
                }}
              ></div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <main className="px-5 py-5">
          <header className="mb-5">
            <h1 className="display-6 fw-bold mb-2">Xin chào Quản lý </h1>
            <p className="fs-5 text-muted">
              Báo cáo tình hình kinh doanh hôm nay, 14 Tháng 1, 2026
            </p>
          </header>

          <div className="row g-4 mb-5">
            {[
              {
                label: "Doanh thu hôm nay",
                val: "12.500.000",
                trend: "+12%",
                sub: "VNĐ",
              },
              {
                label: "Tổng đơn hàng",
                val: "123",
                trend: "Ổn định",
                sub: "Đơn",
              },
              {
                label: "Khách phục vụ",
                val: "45",
                trend: "Tăng",
                sub: "Người",
              },
              {
                label: "Số bàn trống",
                val: "08",
                trend: "Sẵn sàng",
                sub: "Bàn",
              },
            ].map((item, idx) => (
              <div key={idx} className="col-12 col-md-6 col-xxl-3">
                <div style={cardStyle}>
                  <span
                    className="text-muted text-uppercase fw-bold mb-3 d-block"
                    style={{ fontSize: "12px", letterSpacing: "1px" }}
                  >
                    {item.label}
                  </span>
                  <div className="d-flex align-items-baseline gap-2">
                    <h2
                      className="fw-bold mb-0"
                      style={{ color: PRIMARY_COLOR, fontSize: "2.2rem" }}
                    >
                      {item.val}
                    </h2>
                    <span className="text-muted fw-medium">{item.sub}</span>
                  </div>
                  <div
                    className="mt-3 py-1 px-2 rounded-2 d-inline-block"
                    style={{
                      backgroundColor: `${PRIMARY_COLOR}15`,
                      color: PRIMARY_COLOR,
                      fontSize: "13px",
                    }}
                  >
                    <b>{item.trend}</b> so với hôm qua
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-5">
            <div className="col-12 col-xl-8">
              <section style={cardStyle}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                  <h4 className="fw-bold mb-0">Biểu đồ doanh thu theo giờ</h4>
                  <select className="form-select w-auto border-0 bg-light fw-bold">
                    <option>Hôm nay</option>
                    <option>Hôm qua</option>
                  </select>
                </div>
                <div style={{ width: "100%", height: 400 }}>
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
                        tick={{ fontSize: 13 }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: "#f8f9fa" }}
                        contentStyle={{
                          borderRadius: "15px",
                          border: "none",
                          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill={PRIMARY_COLOR}
                        radius={[10, 10, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            <div className="col-12 col-xl-4">
              <section style={cardStyle}>
                <h4 className="fw-bold mb-5">Tỷ lệ món ăn</h4>
                <div className="d-flex flex-column align-items-center">
                  <div
                    style={{ width: "100%", height: 280, position: "relative" }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <div
                        className="fw-bold fs-2"
                        style={{ color: PRIMARY_COLOR }}
                      >
                        123
                      </div>
                      <div className="text-muted fw-bold small">TỔNG MÓN</div>
                    </div>
                  </div>
                  <div className="w-100 mt-4">
                    {pieData.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center mb-2 px-3 py-2 rounded-3"
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "3px",
                            backgroundColor: item.color,
                          }}
                          className="me-3"
                        ></div>
                        <span className="fw-medium text-muted small">
                          {item.name}
                        </span>
                        <span
                          className="ms-auto fw-bold"
                          style={{ color: PRIMARY_COLOR }}
                        >
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
