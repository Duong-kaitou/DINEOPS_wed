import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import {
    Eye, Moon, Search, Sun, Trash2, X, ChevronLeft, ChevronRight,
    ShoppingBag, Clock, CheckCircle, XCircle, RefreshCw, Filter, ArrowUpDown
} from "lucide-react";
import {
    deleteOrder,
    getActiveOrders,
    getOrderById,
    getOrderByPayCode,
    getOrders,
    updateOrderStatus,
} from "../../api/orderApi";

const STATUS_OPTIONS = ["pending", "confirmed", "preparing", "served", "awaiting_payment", "completed", "cancelled"];

const STATUS_CONFIG = {
    pending: { label: "Chờ xác nhận", bg: "#fff7ed", color: "#c2410c", border: "#fed7aa", dot: "#f97316" },
    confirmed: { label: "Đã xác nhận", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6" },
    preparing: { label: "Đang chuẩn bị", bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff", dot: "#a855f7" },
    served: { label: "Đã phục vụ", bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", dot: "#10b981" },
    awaiting_payment: { label: "Chờ thanh toán", bg: "#fefce8", color: "#a16207", border: "#fde68a", dot: "#eab308" },
    completed: { label: "Hoàn tất", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", dot: "#22c55e" },
    cancelled: { label: "Đã hủy", bg: "#fef2f2", color: "#dc2626", border: "#fecaca", dot: "#ef4444" },
};

const toNumber = (v, fallback = 0) => { const n = Number(v); return Number.isFinite(n) ? n : fallback; };
const prettyMoney = (v) => Number(v || 0).toLocaleString("vi-VN");
const normalizeSearchKeyword = (kw) => String(kw || "").trim().replace(/^(ban|bàn|table)\s*/i, "").trim();

const innerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

  .op-scope { font-family: 'Be Vietnam Pro', sans-serif; }

  .op-page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.3px; }
  .op-page-sub   { font-size: 13px; color: #9ca3af; margin: 2px 0 0; }

  /* TOGGLE BTN */
  .op-toggle-btn {
    width: 36px; height: 36px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #f9fafb; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; transition: all .15s; flex-shrink: 0;
  }
  .op-toggle-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

  /* ERROR */
  .op-error {
    display: flex; align-items: center; gap: 8px;
    background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
    padding: 10px 14px; color: #dc2626; font-size: 13px; margin-bottom: 16px;
  }

  /* STATS */
  .op-stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .op-stat {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 14px;
    padding: 15px 18px; display: flex; align-items: center; gap: 12px;
    transition: border-color .2s, box-shadow .2s;
  }
  .op-stat:hover { border-color: #e0e7ff; box-shadow: 0 4px 16px rgba(99,102,241,0.07); }
  .op-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .op-stat-num  { font-size: 22px; font-weight: 700; line-height: 1; color: #111827; }
  .op-stat-lbl  { font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }

  /* FILTER CARD */
  .op-filter-card {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 16px;
    padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  }
  .op-filter-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
  .op-filter-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 130px; }
  .op-filter-group label { font-size: 11px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: .05em; }
  .op-filter-input, .op-filter-select {
    padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13px; font-family: 'Be Vietnam Pro', sans-serif; color: #111827;
    background: #f9fafb; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    -webkit-appearance: none; appearance: none;
  }
  .op-filter-input:focus, .op-filter-select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .op-filter-input-wrap { position: relative; }
  .op-filter-input-wrap > svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
  .op-filter-input-wrap input { padding-left: 32px; }
  .op-select-wrap { position: relative; }
  .op-select-wrap::after { content: '▾'; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; font-size: 11px; }
  .op-select-wrap select { padding-right: 26px; width: 100%; }
  .op-search-btn {
    padding: 8px 20px; border-radius: 9px; background: #6366f1; border: none; color: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s; white-space: nowrap;
    box-shadow: 0 2px 8px rgba(99,102,241,.25); align-self: flex-end;
  }
  .op-search-btn:hover { background: #4f46e5; }

  /* MAIN CARD */
  .op-main-card { background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.05); margin-bottom: 0; }
  .op-card-top  { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f3f4f6; }
  .op-card-title { font-size: 15px; font-weight: 600; color: #111827; }
  .op-card-badge { font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 2px 10px; border-radius: 20px; margin-left: 8px; font-weight: 500; }
  .op-active-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 500; color: #059669;
    background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 20px;
    padding: 3px 10px;
  }
  .op-active-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }

  /* TABLE */
  .op-table { width: 100%; border-collapse: collapse; }
  .op-table thead tr { background: #f9fafb; }
  .op-table th {
    padding: 10px 14px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .05em; color: #6b7280;
    border-bottom: 1px solid #f3f4f6; white-space: nowrap;
  }
  .op-table td {
    padding: 12px 14px; font-size: 13px; color: #374151;
    border-bottom: 1px solid #f9fafb; vertical-align: middle; transition: background .1s;
  }
  .op-table tbody tr { cursor: pointer; }
  .op-table tbody tr:hover td { background: #fafafa; }
  .op-table tbody tr.selected td { background: #eef2ff; }
  .op-table tbody tr:last-child td { border-bottom: none; }

  .op-order-id   { font-size: 12px; color: #9ca3af; font-weight: 600; }
  .op-table-num  { font-weight: 600; color: #111827; }
  .op-pay-code   { font-size: 12px; color: #6b7280; font-family: monospace; background: #f3f4f6; padding: 2px 7px; border-radius: 5px; }
  .op-total      { font-weight: 600; color: #111827; }
  .op-total-sub  { font-size: 11px; color: #9ca3af; font-weight: 400; }

  .op-status-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; white-space: nowrap;
  }
  .op-status-dot-sm { width: 4px; height: 4px; border-radius: 50%; }

  .op-del-btn {
    width: 30px; height: 30px; border-radius: 7px; border: 1.5px solid #e5e7eb;
    background: #f9fafb; color: #9ca3af;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .15s;
  }
  .op-del-btn:hover { border-color: #ef4444; background: #fef2f2; color: #ef4444; }

  /* LOADER / EMPTY */
  .op-loader-row td, .op-empty-row td { text-align: center; padding: 40px 0 !important; color: #9ca3af; }
  .op-spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin .65s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* PAGINATION */
  .op-footer { padding: 12px 20px; border-top: 1px solid #f3f4f6; background: #fafafa; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .op-pg-info { font-size: 12px; color: #9ca3af; }
  .op-pg-btns { display: flex; gap: 5px; }
  .op-pg-btn {
    min-width: 30px; height: 30px; padding: 0 7px;
    border: 1.5px solid #e5e7eb; border-radius: 7px;
    background: #fff; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s;
  }
  .op-pg-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
  .op-pg-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }
  .op-pg-btn:disabled { opacity: .38; cursor: not-allowed; }

  /* DETAIL PANEL */
  .op-detail-card {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px;
    overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.05); height: fit-content;
    position: sticky; top: 16px;
  }
  .op-detail-header { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
  .op-detail-title  { font-size: 15px; font-weight: 600; color: #111827; }

  .op-detail-body   { padding: 18px 20px; }
  .op-detail-empty  { text-align: center; padding: 40px 20px; color: #9ca3af; font-size: 13px; }
  .op-detail-empty-icon { font-size: 32px; margin-bottom: 10px; opacity: .4; }

  .op-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .op-info-item { background: #f9fafb; border-radius: 10px; padding: 10px 12px; }
  .op-info-lbl  { font-size: 10.5px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 3px; }
  .op-info-val  { font-size: 14px; font-weight: 600; color: #111827; }

  .op-status-select-row { display: flex; gap: 8px; align-items: stretch; margin-bottom: 16px; }
  .op-status-select {
    flex: 1; padding: 8px 28px 8px 11px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13px; font-family: 'Be Vietnam Pro', sans-serif; color: #111827;
    background: #f9fafb; outline: none; -webkit-appearance: none; appearance: none;
    transition: border-color .2s;
  }
  .op-status-select:focus { border-color: #6366f1; }
  .op-status-select-wrap { position: relative; flex: 1; }
  .op-status-select-wrap::after { content: '▾'; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; font-size: 11px; }
  .op-update-btn {
    padding: 8px 16px; border-radius: 9px; border: none;
    background: #6366f1; color: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s; white-space: nowrap;
    box-shadow: 0 2px 8px rgba(99,102,241,.25);
  }
  .op-update-btn:hover { background: #4f46e5; }
  .op-delete-order-btn {
    width: 100%; padding: 8px; border-radius: 9px;
    border: 1.5px solid #fecaca; background: #fef2f2;
    color: #dc2626; font-size: 13px; font-weight: 500;
    font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-bottom: 16px;
  }
  .op-delete-order-btn:hover { background: #fee2e2; border-color: #ef4444; }

  .op-divider { height: 1px; background: #f3f4f6; margin: 0 0 14px; }
  .op-items-title { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 10px; }
  .op-items-list  { max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 2px; }
  .op-items-list::-webkit-scrollbar { width: 4px; }
  .op-items-list::-webkit-scrollbar-track { background: #f9fafb; border-radius: 4px; }
  .op-items-list::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

  .op-item-card {
    background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: 10px 12px;
    transition: border-color .15s;
  }
  .op-item-card:hover { border-color: #e0e7ff; }
  .op-item-name  { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 4px; }
  .op-item-meta  { display: flex; justify-content: space-between; align-items: center; }
  .op-item-info  { font-size: 11.5px; color: #6b7280; }
  .op-item-total { font-size: 13px; font-weight: 600; color: #059669; }
  .op-item-note  { font-size: 11px; color: #9ca3af; margin-top: 3px; font-style: italic; }

  .op-size-tag {
    display: inline-block; padding: 1px 7px; border-radius: 5px;
    font-size: 10.5px; font-weight: 600;
    background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe;
    margin-right: 4px;
  }

  @media (max-width: 1200px) {
    .op-stats-row { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 768px) {
    .op-stats-row { grid-template-columns: 1fr 1fr; }
    .op-filter-row { flex-direction: column; }
  }
`;

function OrdersDashboardPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersFilter, setOrdersFilter] = useState({ keyword: "", status: "", ordering: "-created_at" });
    const [searchInput, setSearchInput] = useState("");
    const [statusUpdateValue, setStatusUpdateValue] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, pageSize: 0 });

    const loadOrders = async () => {
        setOrdersLoading(true);
        setGlobalError("");
        try {
            const list = await getOrders({ ...ordersFilter, page: currentPage });
            setOrders(list.data || []);
            const rawPagination = list.pagination || {};
            const totalPages = Math.max(1, toNumber(rawPagination.total_pages) || toNumber(rawPagination.pages) || toNumber(rawPagination.last_page) || 1);
            const totalItems = toNumber(rawPagination.total) || toNumber(rawPagination.count) || (list.data || []).length;
            const pageSize = toNumber(rawPagination.per_page) || toNumber(rawPagination.page_size) || (list.data || []).length;
            setPagination({ totalPages, totalItems, pageSize });
            if (!selectedOrder && list.data?.length) {
                setSelectedOrder(list.data[0]);
                setStatusUpdateValue(list.data[0].status || "pending");
            }
        } catch (error) {
            setGlobalError(error.message || "Không thể tải danh sách đơn hàng");
        } finally {
            setOrdersLoading(false);
        }
    };

    const loadActiveOrders = async () => {
        try {
            const result = await getActiveOrders();
            setActiveOrders(result.data || []);
        } catch { setActiveOrders([]); }
    };

    useEffect(() => { loadOrders(); }, [ordersFilter.keyword, ordersFilter.status, ordersFilter.ordering, currentPage]);
    useEffect(() => { loadActiveOrders(); }, []);

    const handleSearchOrders = () => {
        setCurrentPage(1);
        setOrdersFilter(prev => ({ ...prev, keyword: normalizeSearchKeyword(searchInput) }));
    };

    const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), pagination.totalPages));

    const handleSelectOrder = async (order) => {
        try {
            const detail = await getOrderById(order.id);
            setSelectedOrder(detail);
            setStatusUpdateValue(detail.status || "pending");
        } catch (error) {
            setGlobalError(error.message || "Không thể tải chi tiết đơn hàng");
        }
    };

    const handleUpdateOrderStatus = async () => {
        if (!selectedOrder?.id) return;
        try {
            const updated = await updateOrderStatus(selectedOrder.id, statusUpdateValue);
            setSelectedOrder(updated);
            await loadOrders();
            await loadActiveOrders();
        } catch (error) {
            setGlobalError(error.message || "Không thể cập nhật trạng thái đơn hàng");
        }
    };

    const handleDeleteOrder = async (orderId, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm(`Bạn chắc chắn muốn xóa đơn #${orderId}?`)) return;
        try {
            await deleteOrder(orderId);
            if (selectedOrder?.id === orderId) setSelectedOrder(null);
            await loadOrders();
            await loadActiveOrders();
        } catch (error) {
            setGlobalError(error.message || "Không thể xóa đơn hàng");
        }
    };

    const statsData = [
        { label: "Tổng đơn hàng", value: pagination.totalItems, icon: <ShoppingBag size={18} />, iconBg: "#eef2ff", iconColor: "#6366f1", numColor: "#6366f1" },
        { label: "Đang hoạt động", value: activeOrders.length, icon: <RefreshCw size={18} />, iconBg: "#ecfdf5", iconColor: "#059669", numColor: "#059669" },
        { label: "Chờ xác nhận", value: orders.filter(o => o.status === "pending").length, icon: <Clock size={18} />, iconBg: "#fff7ed", iconColor: "#c2410c", numColor: "#c2410c" },
        { label: "Đã hủy", value: orders.filter(o => o.status === "cancelled").length, icon: <XCircle size={18} />, iconBg: "#fef2f2", iconColor: "#dc2626", numColor: "#dc2626" },
    ];

    const selectedStatusCfg = STATUS_CONFIG[selectedOrder?.status] || STATUS_CONFIG.pending;

    return (
        <>
            <style>{innerStyles}</style>

            <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
                <Sidebar />

                <div className="main-content p-4 op-scope">

                    {/* NAV */}
                    <nav className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="op-page-title">Quản lý Đơn hàng</h2>
                            <p className="op-page-sub">Theo dõi và cập nhật trạng thái đơn hàng</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button className="op-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <div className="rounded-circle" style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0 }} />
                        </div>
                    </nav>

                    {globalError && (
                        <div className="op-error">
                            <X size={14} style={{ flexShrink: 0 }} />
                            {globalError}
                            <button
                                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 0 }}
                                onClick={() => setGlobalError("")}
                            >
                                <X size={13} />
                            </button>
                        </div>
                    )}

                    {/* STATS */}
                    <div className="op-stats-row">
                        {statsData.map(({ label, value, icon, iconBg, iconColor, numColor }) => (
                            <div className="op-stat" key={label}>
                                <div className="op-stat-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
                                <div>
                                    <div className="op-stat-num" style={{ color: numColor }}>{value}</div>
                                    <div className="op-stat-lbl">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row g-3">
                        {/* LEFT COLUMN */}
                        <div className="col-xl-8">

                            {/* FILTER */}
                            <div className="op-filter-card">
                                <div className="op-filter-row">
                                    <div className="op-filter-group" style={{ flex: 2 }}>
                                        <label>Tìm kiếm</label>
                                        <div className="op-filter-input-wrap">
                                            <Search size={14} />
                                            <input
                                                className="op-filter-input"
                                                style={{ width: "100%" }}
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearchOrders(); } }}
                                                placeholder="Số bàn, ghi chú..."
                                            />
                                        </div>
                                    </div>
                                    <div className="op-filter-group">
                                        <label>Trạng thái</label>
                                        <div className="op-select-wrap">
                                            <select
                                                className="op-filter-select"
                                                value={ordersFilter.status}
                                                onChange={(e) => { setCurrentPage(1); setOrdersFilter(prev => ({ ...prev, status: e.target.value })); }}
                                            >
                                                <option value="">Tất cả</option>
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="op-filter-group">
                                        <label>Sắp xếp</label>
                                        <div className="op-select-wrap">
                                            <select
                                                className="op-filter-select"
                                                value={ordersFilter.ordering}
                                                onChange={(e) => { setCurrentPage(1); setOrdersFilter(prev => ({ ...prev, ordering: e.target.value })); }}
                                            >
                                                <option value="-created_at">Mới nhất</option>
                                                <option value="created_at">Cũ nhất</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button className="op-search-btn" onClick={handleSearchOrders}>
                                        Tìm kiếm
                                    </button>
                                </div>
                            </div>

                            {/* TABLE CARD */}
                            <div className="op-main-card">
                                <div className="op-card-top">
                                    <div className="d-flex align-items-center">
                                        <span className="op-card-title">Danh sách đơn hàng</span>
                                        <span className="op-card-badge">{pagination.totalItems} đơn</span>
                                    </div>
                                    <span className="op-active-badge">
                                        <span className="op-active-dot" />
                                        {activeOrders.length} đang hoạt động
                                    </span>
                                </div>

                                <table className="op-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Bàn</th>
                                            <th>Trạng thái</th>
                                            <th>Mã TT</th>
                                            <th>Tổng tiền</th>
                                            <th style={{ textAlign: "center" }}>Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordersLoading ? (
                                            <tr className="op-loader-row">
                                                <td colSpan={6}><span className="op-spinner" />Đang tải đơn hàng...</td>
                                            </tr>
                                        ) : orders.length === 0 ? (
                                            <tr className="op-empty-row">
                                                <td colSpan={6}>Không có đơn hàng trong trang này.</td>
                                            </tr>
                                        ) : (
                                            orders.map((order) => {
                                                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                                return (
                                                    <tr
                                                        key={order.id}
                                                        className={selectedOrder?.id === order.id ? "selected" : ""}
                                                        onClick={() => handleSelectOrder(order)}
                                                    >
                                                        <td><span className="op-order-id">#{order.id}</span></td>
                                                        <td><span className="op-table-num">{order.table_number || order.table}</span></td>
                                                        <td>
                                                            <span className="op-status-pill" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                                                                <span className="op-status-dot-sm" style={{ background: cfg.dot }} />
                                                                {cfg.label}
                                                            </span>
                                                        </td>
                                                        <td><span className="op-pay-code">{order.pay_code || "—"}</span></td>
                                                        <td>
                                                            <span className="op-total">
                                                                {prettyMoney(order.total_amount)}
                                                                <span className="op-total-sub">đ</span>
                                                            </span>
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <button className="op-del-btn" onClick={(e) => handleDeleteOrder(order.id, e)} title="Xóa đơn">
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>

                                {/* PAGINATION */}
                                <div className="op-footer">
                                    <span className="op-pg-info">
                                        Trang {currentPage}/{pagination.totalPages} · {pagination.totalItems} đơn
                                    </span>
                                    <div className="op-pg-btns">
                                        <button className="op-pg-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1 || ordersLoading}>
                                            <ChevronLeft size={13} />
                                        </button>
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                                            .map((page, index, arr) => {
                                                const prevPage = arr[index - 1];
                                                return (
                                                    <React.Fragment key={`opg-${page}`}>
                                                        {prevPage && page - prevPage > 1 && <button className="op-pg-btn" disabled>···</button>}
                                                        <button
                                                            className={`op-pg-btn ${page === currentPage ? "active" : ""}`}
                                                            onClick={() => goToPage(page)}
                                                            disabled={ordersLoading}
                                                        >
                                                            {page}
                                                        </button>
                                                    </React.Fragment>
                                                );
                                            })}
                                        <button className="op-pg-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pagination.totalPages || ordersLoading}>
                                            <ChevronRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN — DETAIL */}
                        <div className="col-xl-4">
                            <div className="op-detail-card">
                                <div className="op-detail-header">
                                    <span className="op-detail-title">Chi tiết đơn hàng</span>
                                    {selectedOrder && (
                                        <span className="op-status-pill" style={{ background: selectedStatusCfg.bg, color: selectedStatusCfg.color, borderColor: selectedStatusCfg.border }}>
                                            <span className="op-status-dot-sm" style={{ background: selectedStatusCfg.dot }} />
                                            {selectedStatusCfg.label}
                                        </span>
                                    )}
                                </div>

                                <div className="op-detail-body">
                                    {!selectedOrder ? (
                                        <div className="op-detail-empty">
                                            <div className="op-detail-empty-icon">🧾</div>
                                            <p>Chọn một đơn hàng để xem chi tiết</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* INFO GRID */}
                                            <div className="op-info-grid">
                                                <div className="op-info-item">
                                                    <div className="op-info-lbl">Mã đơn</div>
                                                    <div className="op-info-val">#{selectedOrder.id}</div>
                                                </div>
                                                <div className="op-info-item">
                                                    <div className="op-info-lbl">Số bàn</div>
                                                    <div className="op-info-val">{selectedOrder.table_number || selectedOrder.table}</div>
                                                </div>
                                                <div className="op-info-item">
                                                    <div className="op-info-lbl">Mã TT</div>
                                                    <div className="op-info-val" style={{ fontSize: "13px", fontFamily: "monospace" }}>{selectedOrder.pay_code || "—"}</div>
                                                </div>
                                                <div className="op-info-item">
                                                    <div className="op-info-lbl">Số món</div>
                                                    <div className="op-info-val">{selectedOrder.items_count || selectedOrder.items?.length || 0}</div>
                                                </div>
                                            </div>

                                            {/* TOTAL */}
                                            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>Tổng tiền</span>
                                                <span style={{ fontSize: 18, fontWeight: 700, color: "#059669" }}>{prettyMoney(selectedOrder.total_amount)}<span style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af" }}>đ</span></span>
                                            </div>

                                            {/* STATUS UPDATE */}
                                            <div className="op-status-select-row">
                                                <div className="op-status-select-wrap">
                                                    <select className="op-status-select" value={statusUpdateValue} onChange={(e) => setStatusUpdateValue(e.target.value)}>
                                                        {STATUS_OPTIONS.map(s => (
                                                            <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button className="op-update-btn" onClick={handleUpdateOrderStatus}>
                                                    Cập nhật
                                                </button>
                                            </div>

                                            {/* DELETE */}
                                            <button className="op-delete-order-btn" onClick={() => handleDeleteOrder(selectedOrder.id)}>
                                                <Trash2 size={13} /> Xóa đơn hàng này
                                            </button>

                                            <div className="op-divider" />

                                            {/* ITEMS */}
                                            <div className="op-items-title">
                                                Danh sách món ({selectedOrder.items?.length || 0})
                                            </div>
                                            {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                                                <div className="op-items-list">
                                                    {selectedOrder.items.map((item) => (
                                                        <div className="op-item-card" key={item.id}>
                                                            <div className="op-item-name">
                                                                {item.product_name || item.variant_details?.product_name || `Món #${item.variant}`}
                                                            </div>
                                                            <div className="op-item-meta">
                                                                <div className="op-item-info">
                                                                    <span className="op-size-tag">
                                                                        {item.size || item.variant_details?.size_display || item.variant_details?.size || "—"}
                                                                    </span>
                                                                    SL: {item.quantity} × {prettyMoney(item.price)}đ
                                                                </div>
                                                                <div className="op-item-total">{prettyMoney(item.total_price)}đ</div>
                                                            </div>
                                                            {item.notes && (
                                                                <div className="op-item-note">💬 {item.notes}</div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>
                                                    Chưa có món trong đơn hàng này.
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrdersDashboardPage;