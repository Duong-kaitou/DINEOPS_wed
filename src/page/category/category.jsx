import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon, Plus, Edit3, Trash2, X, ChevronLeft, ChevronRight, Tag, CheckCircle, Package, PauseCircle } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/menuApi";

const innerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

  .cm-scope { font-family: 'Be Vietnam Pro', sans-serif; }

  .cm-page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.3px; }
  .cm-page-sub   { font-size: 13px; color: #9ca3af; margin: 2px 0 0; font-weight: 400; }

  /* SEARCH */
  .cm-search-wrap { position: relative; width: 320px; }
  .cm-search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
  .cm-search-input {
    width: 100%; padding: 9px 14px 9px 38px;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif;
    background: #f9fafb; color: #111827; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .cm-search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .cm-search-input::placeholder { color: #d1d5db; }

  .cm-toggle-btn {
    width: 36px; height: 36px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #f9fafb; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; transition: all .15s; flex-shrink: 0;
  }
  .cm-toggle-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

  /* STATS */
  .cm-stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .cm-stat {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 14px;
    padding: 16px 18px; display: flex; align-items: center; gap: 12px;
    transition: border-color .2s, box-shadow .2s;
  }
  .cm-stat:hover { border-color: #e0e7ff; box-shadow: 0 4px 16px rgba(99,102,241,0.07); }
  .cm-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cm-stat-num  { font-size: 22px; font-weight: 700; line-height: 1; color: #111827; }
  .cm-stat-lbl  { font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }

  /* MAIN CARD */
  .cm-main-card { background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.05); }
  .cm-card-top  { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f3f4f6; }
  .cm-card-title { font-size: 15px; font-weight: 600; color: #111827; }
  .cm-card-count { font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 2px 10px; border-radius: 20px; margin-left: 8px; font-weight: 500; }

  .cm-btn-add {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; background: #6366f1; color: #fff;
    border: none; border-radius: 10px;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: background .15s, box-shadow .15s, transform .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,0.25);
  }
  .cm-btn-add:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
  .cm-btn-add:active { transform: translateY(0); }

  /* TABLE */
  .cm-table { width: 100%; border-collapse: collapse; }
  .cm-table thead tr { background: #f9fafb; }
  .cm-table th {
    padding: 11px 16px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .05em; color: #6b7280;
    border-bottom: 1px solid #f3f4f6; white-space: nowrap;
  }
  .cm-table td {
    padding: 13px 16px; font-size: 13.5px; color: #374151;
    border-bottom: 1px solid #f9fafb; vertical-align: middle;
    transition: background .1s;
  }
  .cm-table tbody tr:hover td { background: #fafafa; }
  .cm-table tbody tr:last-child td { border-bottom: none; }
  .cm-table tbody tr.inactive td { color: #9ca3af; }

  .cm-cat-name { font-weight: 600; color: #111827; }
  .cm-cat-desc { color: #6b7280; font-size: 13px; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .cm-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 28px; padding: 3px 9px;
    background: #f3f4f6; color: #6b7280;
    border-radius: 20px; font-size: 12px; font-weight: 600;
  }

  /* TOGGLE SWITCH */
  .cm-switch { position: relative; display: inline-block; width: 38px; height: 21px; }
  .cm-switch input { opacity: 0; width: 0; height: 0; }
  .cm-slider {
    position: absolute; inset: 0; cursor: pointer;
    background: #e5e7eb; border-radius: 21px;
    transition: background .2s;
  }
  .cm-slider::before {
    content: ''; position: absolute;
    width: 15px; height: 15px; border-radius: 50%;
    background: #fff; left: 3px; top: 3px;
    transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  .cm-switch input:checked + .cm-slider { background: #6366f1; }
  .cm-switch input:checked + .cm-slider::before { transform: translateX(17px); }

  .cm-action-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 12px; border-radius: 7px;
    border: 1.5px solid #e5e7eb; background: #f9fafb;
    font-size: 12px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    color: #6b7280; cursor: pointer; transition: all .15s;
  }
  .cm-action-btn.edit:hover { border-color: #6366f1; background: #eef2ff; color: #6366f1; }
  .cm-action-btn.del:hover  { border-color: #ef4444; background: #fef2f2; color: #ef4444; }

  /* LOADER / EMPTY */
  .cm-loader-row td { text-align: center; padding: 48px 0 !important; color: #9ca3af; }
  .cm-spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin .65s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .cm-empty-row td { text-align: center; padding: 48px 0 !important; color: #9ca3af; font-size: 13.5px; }

  /* ERROR */
  .cm-error {
    display: flex; align-items: center; gap: 8px;
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 10px; padding: 10px 14px; color: #dc2626; font-size: 13px; margin-bottom: 16px;
  }

  /* CARD FOOTER */
  .cm-footer { padding: 14px 22px; border-top: 1px solid #f3f4f6; background: #fafafa; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .cm-pg-info { font-size: 12.5px; color: #9ca3af; }
  .cm-pg-btns { display: flex; gap: 5px; }
  .cm-pg-btn {
    min-width: 32px; height: 32px; padding: 0 8px;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #fff; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
    font-size: 12.5px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s;
  }
  .cm-pg-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
  .cm-pg-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }
  .cm-pg-btn:disabled { opacity: .38; cursor: not-allowed; }

  /* MODAL */
  .cm-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45); backdrop-filter: blur(4px);
    z-index: 1050; display: flex; align-items: center; justify-content: center;
    animation: fadeOv .18s ease; padding: 16px;
  }
  @keyframes fadeOv { from { opacity: 0; } to { opacity: 1; } }
  .cm-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 480px;
    box-shadow: 0 20px 60px rgba(17,24,39,0.18);
    animation: modalUp .22s cubic-bezier(.34,1.56,.64,1) both; overflow: hidden;
  }
  @keyframes modalUp { from { opacity: 0; transform: translateY(20px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .cm-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #f3f4f6; }
  .cm-modal-title  { font-size: 17px; font-weight: 700; color: #111827; }
  .cm-modal-close  {
    width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #f9fafb; color: #9ca3af;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s;
  }
  .cm-modal-close:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

  .cm-modal-body  { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
  .cm-field label { display: block; font-size: 11.5px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
  .cm-field input, .cm-field textarea {
    width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif; color: #111827;
    background: #f9fafb; outline: none; resize: vertical;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .cm-field input:focus, .cm-field textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }

  .cm-checkbox-row { display: flex; align-items: center; gap: 10px; }
  .cm-checkbox-row label { font-size: 13.5px; color: #374151; font-weight: 500; margin: 0; text-transform: none; letter-spacing: 0; cursor: pointer; }

  .cm-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f3f4f6; background: #fafafa; }
  .cm-btn-cancel {
    padding: 8px 20px; border-radius: 9px; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
  }
  .cm-btn-cancel:hover:not(:disabled) { border-color: #9ca3af; color: #374151; }
  .cm-btn-submit {
    padding: 8px 24px; border-radius: 9px; background: #6366f1; border: none; color: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,.25);
  }
  .cm-btn-submit:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }
  .cm-btn-cancel:disabled, .cm-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  @media (max-width: 900px) {
    .cm-stats-row { grid-template-columns: repeat(2,1fr); }
    .cm-cat-desc  { max-width: 160px; }
  }
  @media (max-width: 600px) {
    .cm-stats-row { grid-template-columns: 1fr 1fr; }
    .cm-search-wrap { width: 200px; }
  }
`;

const STATS_CONFIG = [
  { key: "total", label: "Tổng danh mục", icon: <Tag size={18} />, iconBg: "#eef2ff", iconColor: "#6366f1" },
  { key: "active", label: "Hoạt động", icon: <CheckCircle size={18} />, iconBg: "#ecfdf5", iconColor: "#059669" },
  { key: "dishes", label: "Tổng số món", icon: <Package size={18} />, iconBg: "#fff7ed", iconColor: "#ea580c" },
  { key: "paused", label: "Tạm dừng", icon: <PauseCircle size={18} />, iconBg: "#fffbeb", iconColor: "#b45309" },
];

function CategoryManagement() {
  const [darkMode, setDarkMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
  const [formData, setFormData] = useState({ name: "", description: "", active: true });

  const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const loadCategories = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await getCategories({ ordering: "name", keyword: searchTerm, page: currentPage });
      setCategories(result.data || []);
      const rawPagination = result.pagination || {};
      const totalPages = Math.max(
        1,
        toNumber(rawPagination.total_pages) || toNumber(rawPagination.pages) || toNumber(rawPagination.last_page) || 1
      );
      const totalItems = toNumber(rawPagination.total) || toNumber(rawPagination.count) || (result.data || []).length;
      setPagination({ totalPages, totalItems });
    } catch (error) {
      setErrorMessage(error.message || "Không thể tải danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, [searchTerm, currentPage]);

  const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), pagination.totalPages));

  const toggleStatus = async (category) => {
    try {
      await updateCategory(category.id, { is_active: !category.is_active }, "PATCH");
      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message || "Không thể cập nhật trạng thái");
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", active: true });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description, active: category.is_active });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      is_active: Boolean(formData.active),
    };
    if (!payload.name) { setErrorMessage("Tên danh mục không được để trống"); return; }
    setIsSubmitting(true); setErrorMessage("");
    try {
      if (editingCategory) await updateCategory(editingCategory.id, payload, "PATCH");
      else await createCategory(payload);
      setShowModal(false);
      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message || "Không thể lưu danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      try {
        await deleteCategory(id);
        await loadCategories();
      } catch (error) {
        setErrorMessage(error.message || "Không thể xóa danh mục");
      }
    }
  };

  const statsValues = {
    total: pagination.totalItems,
    active: categories.filter(c => c.is_active).length,
    dishes: categories.reduce((sum, cat) => sum + Number(cat.products_count || 0), 0),
    paused: categories.filter(c => !c.is_active).length,
  };

  const statColors = { total: "#6366f1", active: "#059669", dishes: "#ea580c", paused: "#b45309" };

  return (
    <>
      <style>{innerStyles}</style>

      {/* ── GIỮ NGUYÊN CẤU TRÚC GỐC ── */}
      <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
        <Sidebar />

        <div className="main-content p-4 cm-scope">

          {/* NAV */}
          <nav className="d-flex justify-content-between align-items-center mb-4">
            <div className="cm-search-wrap">
              <Search size={16} />
              <input
                className="cm-search-input"
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="cm-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
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
              <h2 className="cm-page-title">Quản lý Danh mục</h2>
              <p className="cm-page-sub">Danh sách các danh mục món ăn trong thực đơn</p>
            </header>

            {/* ERROR */}
            {errorMessage && (
              <div className="cm-error">
                <X size={14} style={{ flexShrink: 0 }} />
                {errorMessage}
              </div>
            )}

            {/* STATS */}
            <div className="cm-stats-row">
              {STATS_CONFIG.map(({ key, label, icon, iconBg, iconColor }) => (
                <div className="cm-stat" key={key}>
                  <div className="cm-stat-icon" style={{ background: iconBg, color: iconColor }}>
                    {icon}
                  </div>
                  <div>
                    <div className="cm-stat-num" style={{ color: statColors[key] }}>{statsValues[key]}</div>
                    <div className="cm-stat-lbl">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* TABLE CARD */}
            <div className="cm-main-card">
              <div className="cm-card-top">
                <div className="d-flex align-items-center">
                  <span className="cm-card-title">Danh sách danh mục</span>
                  <span className="cm-card-count">{pagination.totalItems} danh mục</span>
                </div>
                <button className="cm-btn-add" onClick={openAddModal}>
                  <Plus size={14} /> Thêm danh mục
                </button>
              </div>

              <table className="cm-table">
                <thead>
                  <tr>
                    <th>Tên danh mục</th>
                    <th>Mô tả</th>
                    <th style={{ textAlign: "center" }}>Số món</th>
                    <th style={{ textAlign: "center" }}>Trạng thái</th>
                    <th style={{ textAlign: "right" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr className="cm-loader-row">
                      <td colSpan={5}>
                        <span className="cm-spinner" />
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr className="cm-empty-row">
                      <td colSpan={5}>Không có danh mục trong trang này.</td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className={!cat.is_active ? "inactive" : ""}>
                        <td className="cm-cat-name">{cat.name}</td>
                        <td>
                          <span className="cm-cat-desc" title={cat.description}>
                            {cat.description || <span style={{ color: "#d1d5db" }}>—</span>}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="cm-badge">{cat.products_count || 0}</span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <label className="cm-switch">
                            <input
                              type="checkbox"
                              checked={Boolean(cat.is_active)}
                              onChange={() => toggleStatus(cat)}
                            />
                            <span className="cm-slider" />
                          </label>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button className="cm-action-btn edit me-2" onClick={() => openEditModal(cat)}>
                            <Edit3 size={11} /> Sửa
                          </button>
                          <button className="cm-action-btn del" onClick={() => handleDelete(cat.id)}>
                            <Trash2 size={11} /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="cm-footer">
                <span className="cm-pg-info">
                  Trang {currentPage}/{pagination.totalPages} · {pagination.totalItems} danh mục
                </span>
                <div className="cm-pg-btns">
                  <button
                    className="cm-pg-btn"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                    .map((page, index, arr) => {
                      const prevPage = arr[index - 1];
                      return (
                        <React.Fragment key={`cpg-${page}`}>
                          {prevPage && page - prevPage > 1 && (
                            <button className="cm-pg-btn" disabled>···</button>
                          )}
                          <button
                            className={`cm-pg-btn ${page === currentPage ? "active" : ""}`}
                            onClick={() => goToPage(page)}
                            disabled={isLoading}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  <button
                    className="cm-pg-btn"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages || isLoading}
                  >
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
        <div
          className="cm-overlay cm-scope"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="cm-modal">
            <div className="cm-modal-header">
              <span className="cm-modal-title">
                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </span>
              <button className="cm-modal-close" onClick={() => setShowModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="cm-modal-body">
                <div className="cm-field">
                  <label>Tên danh mục</label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleInputChange} placeholder="VD: Món khai vị" required
                  />
                </div>

                <div className="cm-field">
                  <label>Mô tả</label>
                  <textarea
                    name="description" value={formData.description}
                    onChange={handleInputChange} rows={3}
                    placeholder="Mô tả ngắn về danh mục..."
                  />
                </div>

                <div className="cm-field">
                  <div className="cm-checkbox-row">
                    <label className="cm-switch" style={{ flexShrink: 0 }}>
                      <input
                        type="checkbox" name="active"
                        checked={formData.active} onChange={handleInputChange}
                      />
                      <span className="cm-slider" />
                    </label>
                    <label htmlFor="active-check" onClick={() => setFormData(p => ({ ...p, active: !p.active }))}>
                      {formData.active ? "Đang hoạt động" : "Tạm dừng"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="cm-modal-footer">
                <button
                  type="button" className="cm-btn-cancel"
                  disabled={isSubmitting} onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="cm-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : editingCategory ? "Lưu thay đổi" : "Thêm danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CategoryManagement;