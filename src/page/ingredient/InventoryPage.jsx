import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import {
  Search, Sun, Moon, Plus, Edit3, Trash2, X,
  Package, AlertTriangle, CheckCircle, XCircle, ChevronLeft, ChevronRight,
} from "lucide-react";

const UNIT_OPTIONS = ["kg", "g", "liter", "ml", "bó", "cái"];

const STATUS_CONFIG = {
  "Còn hàng": { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", dot: "#10b981" },
  "Cảnh báo": { color: "#b45309", bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b" },
  "Hết hàng": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
};

const getStatus = (number_of, min_quantity) => {
  if (number_of === 0) return "Hết hàng";
  if (number_of <= min_quantity) return "Cảnh báo";
  return "Còn hàng";
};

const ITEMS_PER_PAGE = 8;

const innerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

  .iv-scope { font-family: 'Be Vietnam Pro', sans-serif; }

  .iv-page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.3px; }
  .iv-page-sub   { font-size: 13px; color: #9ca3af; margin: 2px 0 0; font-weight: 400; }

  /* SEARCH */
  .iv-search-wrap { position: relative; width: 320px; }
  .iv-search-wrap > svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
  .iv-search-input {
    width: 100%; padding: 9px 14px 9px 38px;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif;
    background: #f9fafb; color: #111827; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .iv-search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .iv-search-input::placeholder { color: #d1d5db; }

  .iv-toggle-btn {
    width: 36px; height: 36px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #f9fafb; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; transition: all .15s; flex-shrink: 0;
  }
  .iv-toggle-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

  /* STATS */
  .iv-stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .iv-stat {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 14px;
    padding: 16px 18px; display: flex; align-items: center; gap: 12px;
    transition: border-color .2s, box-shadow .2s;
  }
  .iv-stat:hover { border-color: #e0e7ff; box-shadow: 0 4px 16px rgba(99,102,241,0.07); }
  .iv-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .iv-stat-num  { font-size: 22px; font-weight: 700; line-height: 1; color: #111827; }
  .iv-stat-lbl  { font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }

  /* MAIN CARD */
  .iv-main-card { background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.05); }
  .iv-card-top  { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f3f4f6; }
  .iv-card-title { font-size: 15px; font-weight: 600; color: #111827; }
  .iv-card-count { font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 2px 10px; border-radius: 20px; margin-left: 8px; font-weight: 500; }

  .iv-btn-add {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; background: #6366f1; color: #fff;
    border: none; border-radius: 10px;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: background .15s, box-shadow .15s, transform .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,0.25);
  }
  .iv-btn-add:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
  .iv-btn-add:active { transform: translateY(0); }

  /* TABLE */
  .iv-table { width: 100%; border-collapse: collapse; }
  .iv-table thead tr { background: #f9fafb; }
  .iv-table th {
    padding: 11px 16px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .05em; color: #6b7280;
    border-bottom: 1px solid #f3f4f6; white-space: nowrap;
  }
  .iv-table td {
    padding: 13px 16px; font-size: 13.5px; color: #374151;
    border-bottom: 1px solid #f9fafb; vertical-align: middle;
    transition: background .1s;
  }
  .iv-table tbody tr:hover td { background: #fafafa; }
  .iv-table tbody tr:last-child td { border-bottom: none; }
  .iv-table tbody tr.out-of-stock td { opacity: .55; }

  .iv-item-name  { font-weight: 600; color: #111827; }
  .iv-unit-tag {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 7px; border: 1px solid #e5e7eb;
    background: #f3f4f6; color: #374151;
    font-size: 11.5px; font-weight: 600;
  }

  /* QUANTITY BAR */
  .iv-qty-wrap { display: flex; flex-direction: column; gap: 4px; min-width: 110px; }
  .iv-qty-val  { font-size: 13.5px; font-weight: 600; color: #111827; }
  .iv-qty-bar-bg { height: 4px; background: #f3f4f6; border-radius: 4px; overflow: hidden; }
  .iv-qty-bar    { height: 100%; border-radius: 4px; transition: width .4s ease; }
  .iv-qty-min  { font-size: 11px; color: #9ca3af; }

  /* STATUS */
  .iv-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; border: 1px solid;
    white-space: nowrap;
  }
  .iv-status-dot { width: 5px; height: 5px; border-radius: 50%; }

  /* ACTIONS */
  .iv-action-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 12px; border-radius: 7px;
    border: 1.5px solid #e5e7eb; background: #f9fafb;
    font-size: 12px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    color: #6b7280; cursor: pointer; transition: all .15s;
  }
  .iv-action-btn.edit:hover { border-color: #6366f1; background: #eef2ff; color: #6366f1; }
  .iv-action-btn.del:hover  { border-color: #ef4444; background: #fef2f2; color: #ef4444; }

  /* EMPTY */
  .iv-empty { text-align: center; padding: 56px 20px; color: #9ca3af; }
  .iv-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: .45; }
  .iv-empty p { font-size: 13.5px; }

  /* FOOTER / PAGINATION */
  .iv-footer { padding: 14px 22px; border-top: 1px solid #f3f4f6; background: #fafafa; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .iv-pg-info { font-size: 12.5px; color: #9ca3af; }
  .iv-pg-btns { display: flex; gap: 5px; }
  .iv-pg-btn {
    min-width: 32px; height: 32px; padding: 0 8px;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #fff; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
    font-size: 12.5px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s;
  }
  .iv-pg-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
  .iv-pg-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }
  .iv-pg-btn:disabled { opacity: .38; cursor: not-allowed; }

  /* MODAL */
  .iv-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45); backdrop-filter: blur(4px);
    z-index: 1050; display: flex; align-items: center; justify-content: center;
    animation: fadeOv .18s ease; padding: 16px;
  }
  @keyframes fadeOv { from { opacity: 0; } to { opacity: 1; } }
  .iv-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 480px;
    box-shadow: 0 20px 60px rgba(17,24,39,0.18);
    animation: modalUp .22s cubic-bezier(.34,1.56,.64,1) both; overflow: hidden;
  }
  @keyframes modalUp { from { opacity: 0; transform: translateY(20px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .iv-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #f3f4f6; }
  .iv-modal-title  { font-size: 17px; font-weight: 700; color: #111827; }
  .iv-modal-close  {
    width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #f9fafb; color: #9ca3af;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s;
  }
  .iv-modal-close:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

  .iv-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
  .iv-field label { display: block; font-size: 11.5px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
  .iv-field input, .iv-field select {
    width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif; color: #111827;
    background: #f9fafb; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    -webkit-appearance: none; appearance: none;
  }
  .iv-field input:focus, .iv-field select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .iv-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .iv-select-wrap { position: relative; }
  .iv-select-wrap::after { content: '▾'; position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; font-size: 12px; }
  .iv-select-wrap select { padding-right: 28px; }
  .iv-input-suffix { position: relative; }
  .iv-input-suffix input { padding-right: 42px; }
  .iv-input-suffix span { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #9ca3af; pointer-events: none; font-weight: 500; }

  .iv-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f3f4f6; background: #fafafa; }
  .iv-btn-cancel {
    padding: 8px 20px; border-radius: 9px; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
  }
  .iv-btn-cancel:hover { border-color: #9ca3af; color: #374151; }
  .iv-btn-submit {
    padding: 8px 24px; border-radius: 9px; background: #6366f1; border: none; color: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,.25);
  }
  .iv-btn-submit:hover { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }

  /* WARNING BANNER */
  .iv-warn-banner {
    display: flex; align-items: center; gap: 10px;
    background: #fffbeb; border: 1px solid #fde68a;
    border-radius: 10px; padding: 10px 16px;
    color: #92400e; font-size: 13px; margin-bottom: 16px;
  }

  @media (max-width: 1000px) { .iv-stats-row { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px)  { .iv-stats-row { grid-template-columns: 1fr 1fr; } .iv-search-wrap { width: 200px; } .iv-field-row { grid-template-columns: 1fr; } }
`;

function InventoryPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [ingredients, setIngredients] = useState([
    { id: 1, name: "Cà phê hạt", unit: "kg", number_of: 50.5, min_quantity: 10 },
    { id: 2, name: "Đường", unit: "kg", number_of: 25.3, min_quantity: 5 },
    { id: 3, name: "Bột mì", unit: "kg", number_of: 3.2, min_quantity: 5 },
    { id: 4, name: "Sữa tươi", unit: "liter", number_of: 0, min_quantity: 10 },
    { id: 5, name: "Bơ", unit: "kg", number_of: 100.5, min_quantity: 20 },
  ]);

  const [formData, setFormData] = useState({ name: "", unit: "kg", number_of: 0, min_quantity: 0 });

  const filtered = ingredients.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  const warningCount = ingredients.filter(i => getStatus(i.number_of, i.min_quantity) === "Cảnh báo").length;
  const outOfStockCount = ingredients.filter(i => getStatus(i.number_of, i.min_quantity) === "Hết hàng").length;
  const okCount = ingredients.filter(i => getStatus(i.number_of, i.min_quantity) === "Còn hàng").length;

  const statsData = [
    { label: "Tổng nguyên liệu", value: ingredients.length, icon: <Package size={18} />, iconBg: "#eef2ff", iconColor: "#6366f1", numColor: "#6366f1" },
    { label: "Còn hàng", value: okCount, icon: <CheckCircle size={18} />, iconBg: "#ecfdf5", iconColor: "#059669", numColor: "#059669" },
    { label: "Cảnh báo", value: warningCount, icon: <AlertTriangle size={18} />, iconBg: "#fffbeb", iconColor: "#b45309", numColor: "#b45309" },
    { label: "Hết hàng", value: outOfStockCount, icon: <XCircle size={18} />, iconBg: "#fef2f2", iconColor: "#dc2626", numColor: "#dc2626" },
  ];

  const openAddModal = () => {
    setEditingIngredient(null);
    setFormData({ name: "", unit: "kg", number_of: 0, min_quantity: 0 });
    setShowModal(true);
  };

  const openEditModal = (ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({ ...ingredient });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "number" ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { alert("Vui lòng nhập tên nguyên liệu"); return; }
    if (editingIngredient) {
      setIngredients(ingredients.map(item => item.id === editingIngredient.id ? { ...item, ...formData } : item));
    } else {
      setIngredients([...ingredients, { id: Math.max(...ingredients.map(i => i.id), 0) + 1, ...formData }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nguyên liệu này?"))
      setIngredients(ingredients.filter(item => item.id !== id));
  };

  // Tính % cho thanh progress
  const getBarPercent = (qty, min) => {
    if (qty === 0) return 0;
    const max = Math.max(qty, min * 3);
    return Math.min(100, Math.round((qty / max) * 100));
  };

  const getBarColor = (status) => {
    if (status === "Còn hàng") return "#10b981";
    if (status === "Cảnh báo") return "#f59e0b";
    return "#ef4444";
  };

  return (
    <>
      <style>{innerStyles}</style>

      <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
        <Sidebar />

        <div className="main-content p-4 iv-scope">

          {/* NAV */}
          <nav className="d-flex justify-content-between align-items-center mb-4">
            <div className="iv-search-wrap">
              <Search size={16} />
              <input
                className="iv-search-input"
                type="text"
                placeholder="Tìm kiếm nguyên liệu..."
                value={searchTerm}
                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="iv-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div className="rounded-circle" style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0 }} />
            </div>
          </nav>

          <main>
            <header className="mb-4">
              <h2 className="iv-page-title">Quản lý Nguyên liệu</h2>
              <p className="iv-page-sub">Quản lý kho và theo dõi hàng tồn kho</p>
            </header>

            {/* STATS */}
            <div className="iv-stats-row">
              {statsData.map(({ label, value, icon, iconBg, iconColor, numColor }) => (
                <div className="iv-stat" key={label}>
                  <div className="iv-stat-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
                  <div>
                    <div className="iv-stat-num" style={{ color: numColor }}>{value}</div>
                    <div className="iv-stat-lbl">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WARNING BANNER */}
            {(warningCount > 0 || outOfStockCount > 0) && (
              <div className="iv-warn-banner">
                <AlertTriangle size={15} style={{ flexShrink: 0, color: "#d97706" }} />
                <span>
                  {outOfStockCount > 0 && <strong>{outOfStockCount} nguyên liệu hết hàng</strong>}
                  {outOfStockCount > 0 && warningCount > 0 && " · "}
                  {warningCount > 0 && <strong>{warningCount} nguyên liệu sắp hết</strong>}
                  {" — cần bổ sung kho ngay."}
                </span>
              </div>
            )}

            {/* TABLE CARD */}
            <div className="iv-main-card">
              <div className="iv-card-top">
                <div className="d-flex align-items-center">
                  <span className="iv-card-title">Danh sách nguyên liệu</span>
                  <span className="iv-card-count">{filtered.length} mục</span>
                </div>
                <button className="iv-btn-add" onClick={openAddModal}>
                  <Plus size={14} /> Thêm nguyên liệu
                </button>
              </div>

              {filtered.length === 0 ? (
                <div className="iv-empty">
                  <div className="iv-empty-icon">📦</div>
                  <p>Không tìm thấy nguyên liệu nào.</p>
                </div>
              ) : (
                <table className="iv-table">
                  <thead>
                    <tr>
                      <th>Tên nguyên liệu</th>
                      <th>Đơn vị</th>
                      <th>Số lượng</th>
                      <th>Mức tối thiểu</th>
                      <th style={{ textAlign: "center" }}>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(item => {
                      const status = getStatus(item.number_of, item.min_quantity);
                      const cfg = STATUS_CONFIG[status];
                      const pct = getBarPercent(item.number_of, item.min_quantity);
                      return (
                        <tr key={item.id} className={item.number_of === 0 ? "out-of-stock" : ""}>
                          <td><span className="iv-item-name">{item.name}</span></td>
                          <td><span className="iv-unit-tag">{item.unit}</span></td>
                          <td>
                            <div className="iv-qty-wrap">
                              <span className="iv-qty-val">{item.number_of}</span>
                              <div className="iv-qty-bar-bg">
                                <div className="iv-qty-bar" style={{ width: `${pct}%`, background: getBarColor(status) }} />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: 13, color: "#6b7280" }}>
                              {item.min_quantity} {item.unit}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span className="iv-status-pill" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                              <span className="iv-status-dot" style={{ background: cfg.dot }} />
                              {status}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button className="iv-action-btn edit me-2" onClick={() => openEditModal(item)}>
                              <Edit3 size={11} /> Sửa
                            </button>
                            <button className="iv-action-btn del" onClick={() => handleDelete(item.id)}>
                              <Trash2 size={11} /> Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* PAGINATION */}
              <div className="iv-footer">
                <span className="iv-pg-info">
                  Hiển thị {Math.min((safePage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} trong {filtered.length} nguyên liệu
                </span>
                <div className="iv-pg-btns">
                  <button className="iv-pg-btn" onClick={() => goToPage(safePage - 1)} disabled={safePage <= 1}>
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .map((page, index, arr) => {
                      const prev = arr[index - 1];
                      return (
                        <React.Fragment key={`ipg-${page}`}>
                          {prev && page - prev > 1 && <button className="iv-pg-btn" disabled>···</button>}
                          <button
                            className={`iv-pg-btn ${page === safePage ? "active" : ""}`}
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  <button className="iv-pg-btn" onClick={() => goToPage(safePage + 1)} disabled={safePage >= totalPages}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="iv-overlay iv-scope" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="iv-modal">
            <div className="iv-modal-header">
              <span className="iv-modal-title">
                {editingIngredient ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu mới"}
              </span>
              <button className="iv-modal-close" onClick={() => setShowModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="iv-modal-body">
                {/* Tên */}
                <div className="iv-field">
                  <label>Tên nguyên liệu <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleInputChange} placeholder="VD: Cà phê hạt, Đường..." required
                  />
                </div>

                {/* Đơn vị + Số lượng */}
                <div className="iv-field-row">
                  <div className="iv-field">
                    <label>Đơn vị <span style={{ color: "#ef4444" }}>*</span></label>
                    <div className="iv-select-wrap">
                      <select name="unit" value={formData.unit} onChange={handleInputChange} required>
                        {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="iv-field">
                    <label>Số lượng <span style={{ color: "#ef4444" }}>*</span></label>
                    <div className="iv-input-suffix">
                      <input
                        type="number" name="number_of" value={formData.number_of}
                        onChange={handleInputChange} min="0" step="0.1" required
                      />
                      <span>{formData.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Mức tối thiểu */}
                <div className="iv-field">
                  <label>Mức tối thiểu <span style={{ color: "#ef4444" }}>*</span></label>
                  <div className="iv-input-suffix">
                    <input
                      type="number" name="min_quantity" value={formData.min_quantity}
                      onChange={handleInputChange} min="0" step="0.1" required
                    />
                    <span>{formData.unit}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 5 }}>
                    Khi số lượng ≤ mức này, hệ thống sẽ cảnh báo
                  </div>
                </div>

                {/* Preview trạng thái */}
                {(() => {
                  const previewStatus = getStatus(formData.number_of, formData.min_quantity);
                  const cfg = STATUS_CONFIG[previewStatus];
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f9fafb", borderRadius: 9, padding: "10px 12px", border: "1px solid #f3f4f6" }}>
                      <span style={{ fontSize: 11.5, color: "#6b7280", fontWeight: 500 }}>Trạng thái dự kiến:</span>
                      <span className="iv-status-pill" style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                        <span className="iv-status-dot" style={{ background: cfg.dot }} />
                        {previewStatus}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="iv-modal-footer">
                <button type="button" className="iv-btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="iv-btn-submit">
                  {editingIngredient ? "Lưu thay đổi" : "Thêm nguyên liệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default InventoryPage;