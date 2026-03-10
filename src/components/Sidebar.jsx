import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Receipt,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../assets/logo.svg";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/dashboard" },
    { icon: Utensils, label: "Menu", path: "/menu" },
    { icon: Receipt, label: "Nguyên liệu", path: "/ingredient" },
    { icon: Users, label: "Sơ đồ bàn", path: "/desk-diagram" },
    { icon: BarChart3, label: "Danh Mục", path: "/category" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo mb-4 d-flex align-items-center gap-2">
        <img src={logo} alt="Logo" width="40" />
        <span className="fw-bold fs-4" style={{ color: "var(--primary-dine)" }}>
          DINEOPS
        </span>
      </div>

      <ul className="nav nav-pills flex-column mb-auto gap-2">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <button
              onClick={() => navigate(item.path)}
              className="nav-link-custom"
              style={{
                backgroundColor: isActive(item.path)
                  ? "var(--primary-dine)"
                  : "transparent",
                color: isActive(item.path) ? "white" : "#666",
                border: "none",
                width: "100%",
                textAlign: "left",
                padding: "12px 20px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <item.icon size={20} />
              <span className="fw-bold">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <hr />

      <div className="sidebar-footer d-flex flex-column gap-2">
        <button className="btn d-flex align-items-center gap-2 text-secondary">
          <Settings size={20} /> <span>Cài đặt</span>
        </button>
        <button
          onClick={handleLogout}
          className="btn d-flex align-items-center gap-2 text-danger"
        >
          <LogOut size={20} /> <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
