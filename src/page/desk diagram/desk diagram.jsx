import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon, Plus, Edit3, Trash2, Users, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  createTable,
  deleteTable,
  getTablesWithPagination,
  updateTable,
  updateTableStatus,
} from "../../api/tableApi";

const TABLE_STATUSES = ["available", "occupied", "reserved"];

const mapApiTableToUi = (table) => ({
  id: table.id,
  name: table.table_number || `Bàn ${table.id}`,
  seats: Number(table.capacity) || 0,
  location: table.location || "-",
  status: TABLE_STATUSES.includes(table.status) ? table.status : "available",
});

const STATUS_CONFIG = {
  available: { label: "Trống", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", dot: "#10b981" },
  occupied: { label: "Có khách", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
  reserved: { label: "Đặt trước", color: "#b45309", bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b" },
};

const innerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

  .fm-scope { font-family: 'Be Vietnam Pro', sans-serif; }

  .fm-page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.3px; }
  .fm-page-sub   { font-size: 13px; color: #9ca3af; margin: 2px 0 0; font-weight: 400; }

  /* SEARCH */
  .fm-search-wrap { position: relative; width: 320px; }
  .fm-search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
  .fm-search-input {
    width: 100%; padding: 9px 14px 9px 38px;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif;
    background: #f9fafb; color: #111827; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .fm-search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .fm-search-input::placeholder { color: #d1d5db; }

  .fm-toggle-btn {
    width: 36px; height: 36px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #f9fafb; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; transition: all .15s; flex-shrink: 0;
  }
  .fm-toggle-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

  /* STATS */
  .fm-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 24px; }
  .fm-stat {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 14px;
    padding: 16px 20px; display: flex; align-items: center; gap: 14px;
    transition: border-color .2s, box-shadow .2s;
  }
  .fm-stat:hover { border-color: #e0e7ff; box-shadow: 0 4px 16px rgba(99,102,241,0.07); }
  .fm-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
  .fm-stat-num  { font-size: 24px; font-weight: 700; line-height: 1; color: #111827; }
  .fm-stat-lbl  { font-size: 11.5px; color: #9ca3af; margin-top: 2px; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }

  /* CARD */
  .fm-main-card { background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px; padding: 24px; box-shadow: 0 1px 8px rgba(0,0,0,0.05); }
  .fm-card-top  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .fm-card-title { font-size: 15px; font-weight: 600; color: #111827; }
  .fm-card-count { font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 2px 10px; border-radius: 20px; margin-left: 8px; font-weight: 500; }

  .fm-btn-add {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; background: #6366f1; color: #fff;
    border: none; border-radius: 10px;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: background .15s, box-shadow .15s, transform .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,0.25);
  }
  .fm-btn-add:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
  .fm-btn-add:active { transform: translateY(0); }

  /* GRID */
  .fm-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
  @media (max-width: 1200px) { .fm-grid { grid-template-columns: repeat(4, 1fr); } }
  @media (max-width: 900px)  { .fm-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 600px)  { .fm-grid { grid-template-columns: repeat(2, 1fr); } }

  /* TABLE CARD */
  .fm-tcard {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 14px; padding: 16px;
    transition: border-color .2s, box-shadow .2s, transform .2s;
    animation: tcardIn .25s ease both; position: relative; overflow: hidden;
  }
  @keyframes tcardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .fm-tcard:hover { border-color: #c7d2fe; box-shadow: 0 6px 20px rgba(99,102,241,0.1); transform: translateY(-2px); }

  .fm-tcard-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .fm-status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; }
  .fm-status-dot  { width: 5px; height: 5px; border-radius: 50%; }
  .fm-tcard-id    { font-size: 11px; color: #d1d5db; font-weight: 500; }

  .fm-tcard-name  { font-size: 17px; font-weight: 700; color: #111827; margin-bottom: 10px; letter-spacing: -0.2px; }
  .fm-tcard-meta  { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .fm-tcard-row   { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; }
  .fm-tcard-row svg { color: #a5b4fc; flex-shrink: 0; }

  .fm-tcard-actions { display: flex; gap: 7px; }
  .fm-tcard-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px;
    padding: 6px 0; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #f9fafb;
    font-size: 11.5px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    color: #6b7280; cursor: pointer; transition: all .15s;
  }
  .fm-tcard-btn.edit:hover { border-color: #6366f1; background: #eef2ff; color: #6366f1; }
  .fm-tcard-btn.del:hover  { border-color: #ef4444; background: #fef2f2; color: #ef4444; }

  /* ERROR */
  .fm-error {
    display: flex; align-items: center; gap: 8px;
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 10px; padding: 10px 14px; color: #dc2626; font-size: 13px; margin-bottom: 16px;
  }

  /* LOADING / EMPTY */
  .fm-loader { grid-column: 1/-1; text-align: center; padding: 48px 0; color: #9ca3af; font-size: 13.5px; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .fm-spinner { width: 18px; height: 18px; border: 2px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin .65s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fm-empty-state { grid-column: 1/-1; text-align: center; padding: 48px 0; color: #9ca3af; font-size: 13.5px; }
  .fm-empty-icon  { font-size: 32px; margin-bottom: 10px; opacity: .5; }

  /* PAGINATION */
  .fm-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; flex-wrap: wrap; gap: 10px; }
  .fm-pg-info    { font-size: 12.5px; color: #9ca3af; }
  .fm-pg-btns    { display: flex; gap: 5px; }
  .fm-pg-btn {
    min-width: 32px; height: 32px; padding: 0 8px;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #fff; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
    font-size: 12.5px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s;
  }
  .fm-pg-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
  .fm-pg-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }
  .fm-pg-btn:disabled { opacity: .38; cursor: not-allowed; }

  /* MODAL */
  .fm-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45); backdrop-filter: blur(4px);
    z-index: 1050; display: flex; align-items: center; justify-content: center;
    animation: fadeOv .18s ease; padding: 16px;
  }
  @keyframes fadeOv { from { opacity: 0; } to { opacity: 1; } }
  .fm-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 460px;
    box-shadow: 0 20px 60px rgba(17,24,39,0.18);
    animation: modalUp .22s cubic-bezier(.34,1.56,.64,1) both; overflow: hidden;
  }
  @keyframes modalUp { from { opacity: 0; transform: translateY(20px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .fm-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #f3f4f6; }
  .fm-modal-title  { font-size: 17px; font-weight: 700; color: #111827; }
  .fm-modal-close  {
    width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #f9fafb; color: #9ca3af;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s;
  }
  .fm-modal-close:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

  .fm-modal-body   { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
  .fm-field label  { display: block; font-size: 11.5px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
  .fm-field input, .fm-field select {
    width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif; color: #111827;
    background: #f9fafb; outline: none; transition: border-color .2s, box-shadow .2s, background .2s;
    -webkit-appearance: none; appearance: none;
  }
  .fm-field input:focus, .fm-field select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .fm-field-row    { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .fm-select-wrap  { position: relative; }
  .fm-select-wrap::after { content: '▾'; position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; font-size: 12px; }
  .fm-select-wrap select { padding-right: 28px; }

  .fm-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f3f4f6; background: #fafafa; }
  .fm-btn-cancel {
    padding: 8px 20px; border-radius: 9px; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
  }
  .fm-btn-cancel:hover:not(:disabled) { border-color: #9ca3af; color: #374151; }
  .fm-btn-submit {
    padding: 8px 24px; border-radius: 9px; background: #6366f1; border: none; color: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,.25);
  }
  .fm-btn-submit:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }
  .fm-btn-cancel:disabled, .fm-btn-submit:disabled { opacity: .5; cursor: not-allowed; }
`;

function FloorManagement() {
  const [darkMode, setDarkMode] = useState(false);
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [tablesError, setTablesError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ name: "", seats: 2, location: "", status: "available" });

  const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const loadTables = async () => {
    setIsLoadingTables(true);
    setTablesError("");
    try {
      const result = await getTablesWithPagination({ search: searchTerm, page: currentPage });
      const apiTables = result.data || [];
      const mappedTables = apiTables.map(mapApiTableToUi);
      setTables(mappedTables);
      const rawPagination = result.pagination || {};
      const totalPages = Math.max(
        1,
        toNumber(rawPagination.total_pages) || toNumber(rawPagination.pages) || toNumber(rawPagination.last_page) || 1
      );
      const totalItems = toNumber(rawPagination.total) || toNumber(rawPagination.count) || mappedTables.length;
      setPagination({ totalPages, totalItems });
    } catch (error) {
      setTablesError(error?.message || "Không thể tải danh sách bàn. Vui lòng kiểm tra đăng nhập hoặc API.");
    } finally {
      setIsLoadingTables(false);
    }
  };

  useEffect(() => { loadTables(); }, [searchTerm, currentPage]);

  const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), pagination.totalPages));

  const statsData = [
    { status: "available", count: tables.filter(t => t.status === "available").length, icon: "🟢", label: "Bàn trống" },
    { status: "occupied", count: tables.filter(t => t.status === "occupied").length, icon: "🔴", label: "Có khách" },
    { status: "reserved", count: tables.filter(t => t.status === "reserved").length, icon: "🟡", label: "Đặt trước" },
  ];

  const openAddModal = () => {
    setEditingTable(null);
    setFormData({ name: "", seats: 2, location: "", status: "available" });
    setShowModal(true);
  };

  const openEditModal = (table) => {
    setEditingTable(table);
    setFormData({ name: table.name, seats: table.seats, location: table.location, status: table.status });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "seats" ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      table_number: formData.name.trim(),
      capacity: Number(formData.seats) || 0,
      status: formData.status,
      location: formData.location.trim(),
    };
    if (!payload.table_number) { setTablesError("Tên bàn không được để trống."); return; }
    setIsSaving(true); setTablesError("");
    try {
      if (editingTable) {
        const statusChangedOnly =
          editingTable.status !== payload.status &&
          editingTable.name === payload.table_number &&
          Number(editingTable.seats) === payload.capacity &&
          String(editingTable.location || "") === payload.location;
        if (statusChangedOnly) await updateTableStatus(editingTable.id, payload.status);
        else await updateTable(editingTable.id, payload, "PATCH");
      } else {
        await createTable(payload);
      }
      await loadTables();
      setShowModal(false);
    } catch (error) {
      setTablesError(error?.message || "Không thể lưu thông tin bàn. Vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tableId) => {
    if (window.confirm("Bạn có chắc muốn xóa bàn này?")) {
      try {
        setTablesError("");
        await deleteTable(tableId);
        await loadTables();
      } catch (error) {
        setTablesError(error?.message || "Không thể xóa bàn. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <>
      <style>{innerStyles}</style>

      {/* ── GIỮ NGUYÊN CẤU TRÚC GỐC ── */}
      <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
        <Sidebar />

        <div className="main-content p-4 fm-scope">

          {/* NAV – giữ nguyên lớp ngoài, chỉ làm mới nội dung */}
          <nav className="d-flex justify-content-between align-items-center mb-4">
            <div className="fm-search-wrap">
              <Search size={16} />
              <input
                className="fm-search-input"
                type="text"
                placeholder="Tìm kiếm bàn..."
                value={searchTerm}
                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
              />
            </div>

            <div className="d-flex align-items-center gap-2">
              <button className="fm-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div
                className="rounded-circle"
                style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0 }}
              />
            </div>
          </nav>

          <main>
            <header className="mb-4">
              <h2 className="fm-page-title">Sơ đồ Bàn &amp; Tầng</h2>
              <p className="fm-page-sub">Quản lý bàn ăn và không gian phục vụ</p>
            </header>

            {/* STATS */}
            <div className="fm-stats-row">
              {statsData.map(({ status, count, icon, label }) => {
                const cfg = STATUS_CONFIG[status];
                return (
                  <div className="fm-stat" key={status}>
                    <div className="fm-stat-icon" style={{ background: cfg.bg }}>{icon}</div>
                    <div>
                      <div className="fm-stat-num" style={{ color: cfg.color }}>{count}</div>
                      <div className="fm-stat-lbl">{label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MAIN CARD */}
            <div className="fm-main-card">
              <div className="fm-card-top">
                <div className="d-flex align-items-center">
                  <span className="fm-card-title">Danh sách bàn</span>
                  <span className="fm-card-count">{pagination.totalItems} bàn</span>
                </div>
                <button className="fm-btn-add" onClick={openAddModal}>
                  <Plus size={14} /> Thêm bàn
                </button>
              </div>

              {tablesError && (
                <div className="fm-error">
                  <X size={14} style={{ flexShrink: 0 }} />
                  {tablesError}
                </div>
              )}

              <div className="fm-grid">
                {isLoadingTables ? (
                  <div className="fm-loader">
                    <div className="fm-spinner" />
                    Đang tải danh sách bàn...
                  </div>
                ) : tables.length === 0 ? (
                  <div className="fm-empty-state">
                    <div className="fm-empty-icon">🪑</div>
                    <p>Không có bàn trong trang này.</p>
                  </div>
                ) : (
                  tables.map((table, i) => {
                    const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.available;
                    return (
                      <div
                        className="fm-tcard"
                        key={table.id}
                        style={{ animationDelay: `${i * 0.035}s` }}
                      >
                        <div className="fm-tcard-top">
                          <div
                            className="fm-status-pill"
                            style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                          >
                            <span className="fm-status-dot" style={{ background: cfg.dot }} />
                            {cfg.label}
                          </div>
                          <span className="fm-tcard-id">#{table.id}</span>
                        </div>

                        <div className="fm-tcard-name">{table.name}</div>

                        <div className="fm-tcard-meta">
                          <div className="fm-tcard-row">
                            <Users size={12} /> {table.seats} chỗ ngồi
                          </div>
                          <div className="fm-tcard-row">
                            <MapPin size={12} /> {table.location}
                          </div>
                        </div>

                        <div className="fm-tcard-actions">
                          <button className="fm-tcard-btn edit" onClick={() => openEditModal(table)}>
                            <Edit3 size={11} /> Sửa
                          </button>
                          <button className="fm-tcard-btn del" onClick={() => handleDelete(table.id)}>
                            <Trash2 size={11} /> Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* PAGINATION */}
              <div className="fm-pagination">
                <span className="fm-pg-info">
                  Trang {currentPage}/{pagination.totalPages} · {pagination.totalItems} bàn
                </span>
                <div className="fm-pg-btns">
                  <button
                    className="fm-pg-btn"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoadingTables}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                    .map((page, index, arr) => {
                      const prevPage = arr[index - 1];
                      return (
                        <React.Fragment key={`pg-${page}`}>
                          {prevPage && page - prevPage > 1 && (
                            <button className="fm-pg-btn" disabled>···</button>
                          )}
                          <button
                            className={`fm-pg-btn ${page === currentPage ? "active" : ""}`}
                            onClick={() => goToPage(page)}
                            disabled={isLoadingTables}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  <button
                    className="fm-pg-btn"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages || isLoadingTables}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL – fixed overlay để tránh bị cắt bởi overflow của layout */}
      {showModal && (
        <div
          className="fm-overlay fm-scope"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="fm-modal">
            <div className="fm-modal-header">
              <span className="fm-modal-title">
                {editingTable ? "Chỉnh sửa bàn" : "Thêm bàn mới"}
              </span>
              <button className="fm-modal-close" onClick={() => setShowModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="fm-modal-body">
                <div className="fm-field">
                  <label>Tên bàn</label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleInputChange} placeholder="VD: Bàn 01" required
                  />
                </div>

                <div className="fm-field-row">
                  <div className="fm-field">
                    <label>Số chỗ ngồi</label>
                    <input type="number" name="seats" value={formData.seats} onChange={handleInputChange} min={1} />
                  </div>
                  <div className="fm-field">
                    <label>Trạng thái</label>
                    <div className="fm-select-wrap">
                      <select name="status" value={formData.status} onChange={handleInputChange}>
                        <option value="available">Trống</option>
                        <option value="occupied">Có khách</option>
                        <option value="reserved">Đặt trước</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="fm-field">
                  <label>Vị trí</label>
                  <input
                    type="text" name="location" value={formData.location}
                    onChange={handleInputChange} placeholder="VD: Tầng 1 – Khu A"
                  />
                </div>
              </div>

              <div className="fm-modal-footer">
                <button
                  type="button" className="fm-btn-cancel"
                  disabled={isSaving} onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="fm-btn-submit" disabled={isSaving}>
                  {isSaving ? "Đang lưu..." : editingTable ? "Lưu thay đổi" : "Thêm bàn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FloorManagement;