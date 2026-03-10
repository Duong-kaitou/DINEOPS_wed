import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/style/main.css";
import Sidebar from "../../components/Sidebar";

import { Search, Sun, Moon, BarChart3 } from "lucide-react";
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

  const stats = [
    {
      label: "Doanh thu hôm nay",
      val: "12.500.000",
      trend: "+12%",
      sub: "VNĐ",
    },
    { label: "Tổng đơn hàng", val: "123", trend: "Ổn định", sub: "Đơn" },
    { label: "Khách phục vụ", val: "45", trend: "Tăng", sub: "Người" },
    { label: "Số bàn trống", val: "08", trend: "Sẵn sàng", sub: "Bàn" },
  ];

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
            <p className="text-muted">
              Báo cáo tình hình kinh doanh hôm nay, 14 Tháng 1, 2026
            </p>
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
                  <div className="small text-success fw-bold">{item.trend}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-12 col-xl-8">
              <div className="dashboard-card bg-white">
                <h5 className="fw-bold mb-4">Biểu đồ doanh thu theo giờ</h5>
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
                    <div className="fs-3 fw-bold">123</div>
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
