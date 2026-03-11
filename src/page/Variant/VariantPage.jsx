import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Moon, Search, Sun, Plus, Edit3, Trash2, X, ChevronLeft, ChevronRight, RefreshCw, Layers, CheckCircle, PauseCircle, DollarSign } from "lucide-react";
import {
    createVariant,
    deleteVariant,
    getProducts,
    getVariants,
    updateVariant,
} from "../../api/menuApi";

const SIZE_OPTIONS = ["S", "M", "L", "XL"];

const SIZE_STYLE = {
    S: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    M: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    L: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    XL: { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
};

const innerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

  .vp-scope { font-family: 'Be Vietnam Pro', sans-serif; }

  .vp-page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.3px; }
  .vp-page-sub   { font-size: 13px; color: #9ca3af; margin: 2px 0 0; font-weight: 400; }

  /* SEARCH */
  .vp-search-wrap { position: relative; width: 320px; }
  .vp-search-wrap > svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
  .vp-search-input {
    width: 100%; padding: 9px 14px 9px 38px;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif;
    background: #f9fafb; color: #111827; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .vp-search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .vp-search-input::placeholder { color: #d1d5db; }

  .vp-toggle-btn {
    width: 36px; height: 36px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #f9fafb; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; transition: all .15s; flex-shrink: 0;
  }
  .vp-toggle-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

  /* STATS */
  .vp-stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .vp-stat {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 14px;
    padding: 16px 18px; display: flex; align-items: center; gap: 12px;
    transition: border-color .2s, box-shadow .2s;
  }
  .vp-stat:hover { border-color: #e0e7ff; box-shadow: 0 4px 16px rgba(99,102,241,0.07); }
  .vp-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .vp-stat-num  { font-size: 22px; font-weight: 700; line-height: 1; color: #111827; }
  .vp-stat-lbl  { font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }

  /* ERROR */
  .vp-error {
    display: flex; align-items: center; gap: 8px;
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 10px; padding: 10px 14px; color: #dc2626; font-size: 13px; margin-bottom: 16px;
  }

  /* MAIN CARD */
  .vp-main-card { background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.05); }
  .vp-card-top  { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f3f4f6; }
  .vp-card-title { font-size: 15px; font-weight: 600; color: #111827; }
  .vp-card-count { font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 2px 10px; border-radius: 20px; margin-left: 8px; font-weight: 500; }

  .vp-btn-add {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; background: #6366f1; color: #fff;
    border: none; border-radius: 10px;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: background .15s, box-shadow .15s, transform .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,0.25);
  }
  .vp-btn-add:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
  .vp-btn-add:active { transform: translateY(0); }

  /* TABLE */
  .vp-table { width: 100%; border-collapse: collapse; }
  .vp-table thead tr { background: #f9fafb; }
  .vp-table th {
    padding: 11px 16px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .05em; color: #6b7280;
    border-bottom: 1px solid #f3f4f6; white-space: nowrap;
  }
  .vp-table td {
    padding: 13px 16px; font-size: 13.5px; color: #374151;
    border-bottom: 1px solid #f9fafb; vertical-align: middle;
    transition: background .1s;
  }
  .vp-table tbody tr:hover td { background: #fafafa; }
  .vp-table tbody tr:last-child td { border-bottom: none; }

  .vp-product-name { font-weight: 600; color: #111827; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* SIZE BADGE */
  .vp-size-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 70px; height: 32px; border-radius: 8px;
    font-size: 12px; font-weight: 700; border: 1px solid;
  }

  /* PRICE */
  .vp-price { font-weight: 600; color: #111827; font-size: 13.5px; }
  .vp-price-sub { font-size: 11px; color: #9ca3af; font-weight: 400; }

  /* STATUS */
  .vp-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; border: 1px solid;
  }
  .vp-status-dot { width: 5px; height: 5px; border-radius: 50%; }

  /* TOGGLE SWITCH */
  .vp-switch { position: relative; display: inline-block; width: 38px; height: 21px; }
  .vp-switch input { opacity: 0; width: 0; height: 0; }
  .vp-slider {
    position: absolute; inset: 0; cursor: pointer;
    background: #e5e7eb; border-radius: 21px; transition: background .2s;
  }
  .vp-slider::before {
    content: ''; position: absolute; width: 15px; height: 15px; border-radius: 50%;
    background: #fff; left: 3px; top: 3px; transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  .vp-switch input:checked + .vp-slider { background: #6366f1; }
  .vp-switch input:checked + .vp-slider::before { transform: translateX(17px); }

  /* ACTION BUTTONS */
  .vp-action-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 10px; border-radius: 7px;
    border: 1.5px solid #e5e7eb; background: #f9fafb;
    font-size: 12px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    color: #6b7280; cursor: pointer; transition: all .15s;
  }
  .vp-action-btn.edit:hover    { border-color: #6366f1; background: #eef2ff; color: #6366f1; }
  .vp-action-btn.del:hover     { border-color: #ef4444; background: #fef2f2; color: #ef4444; }
  .vp-action-btn.toggle:hover  { border-color: #f59e0b; background: #fffbeb; color: #b45309; }

  /* LOADER / EMPTY */
  .vp-loader-row td, .vp-empty-row td { text-align: center; padding: 48px 0 !important; color: #9ca3af; }
  .vp-spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin .65s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* FOOTER / PAGINATION */
  .vp-footer { padding: 14px 22px; border-top: 1px solid #f3f4f6; background: #fafafa; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .vp-pg-info { font-size: 12.5px; color: #9ca3af; }
  .vp-pg-btns { display: flex; gap: 5px; }
  .vp-pg-btn {
    min-width: 32px; height: 32px; padding: 0 8px;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #fff; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
    font-size: 12.5px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s;
  }
  .vp-pg-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
  .vp-pg-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }
  .vp-pg-btn:disabled { opacity: .38; cursor: not-allowed; }

  /* MODAL */
  .vp-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45); backdrop-filter: blur(4px);
    z-index: 1050; display: flex; align-items: center; justify-content: center;
    animation: fadeOv .18s ease; padding: 16px;
  }
  @keyframes fadeOv { from { opacity: 0; } to { opacity: 1; } }
  .vp-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 480px;
    box-shadow: 0 20px 60px rgba(17,24,39,0.18);
    animation: modalUp .22s cubic-bezier(.34,1.56,.64,1) both; overflow: hidden;
  }
  @keyframes modalUp { from { opacity: 0; transform: translateY(20px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .vp-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #f3f4f6; }
  .vp-modal-title  { font-size: 17px; font-weight: 700; color: #111827; }
  .vp-modal-close  {
    width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #f9fafb; color: #9ca3af;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s;
  }
  .vp-modal-close:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

  .vp-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
  .vp-field label { display: block; font-size: 11.5px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
  .vp-field input, .vp-field select {
    width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif; color: #111827;
    background: #f9fafb; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    -webkit-appearance: none; appearance: none;
  }
  .vp-field input:focus, .vp-field select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .vp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* SIZE PICKER */
  .vp-size-picker { display: flex; gap: 8px; }
  .vp-size-opt {
    flex: 1; padding: 8px 0; border-radius: 9px; border: 1.5px solid #e5e7eb;
    background: #f9fafb; color: #6b7280;
    font-size: 13px; font-weight: 600; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s; text-align: center;
  }
  .vp-size-opt:hover  { border-color: #a5b4fc; color: #4f46e5; background: #eef2ff; }
  .vp-size-opt.active { border-color: #6366f1; background: #6366f1; color: #fff; box-shadow: 0 2px 8px rgba(99,102,241,.3); }

  .vp-select-wrap { position: relative; }
  .vp-select-wrap::after { content: '▾'; position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; font-size: 12px; }
  .vp-select-wrap select { padding-right: 28px; }

  .vp-price-input-wrap { position: relative; }
  .vp-price-input-wrap input { padding-right: 32px; }
  .vp-price-suffix { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #9ca3af; font-weight: 500; pointer-events: none; }

  .vp-checkbox-row { display: flex; align-items: center; gap: 10px; }
  .vp-checkbox-row span { font-size: 13.5px; color: #374151; font-weight: 500; cursor: pointer; }

  .vp-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f3f4f6; background: #fafafa; }
  .vp-btn-cancel {
    padding: 8px 20px; border-radius: 9px; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
  }
  .vp-btn-cancel:hover:not(:disabled) { border-color: #9ca3af; color: #374151; }
  .vp-btn-submit {
    padding: 8px 24px; border-radius: 9px; background: #6366f1; border: none; color: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,.25);
  }
  .vp-btn-submit:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }
  .vp-btn-cancel:disabled, .vp-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  @media (max-width: 900px) {
    .vp-stats-row { grid-template-columns: repeat(2,1fr); }
    .vp-product-name { max-width: 120px; }
  }
  @media (max-width: 600px) {
    .vp-search-wrap { width: 200px; }
    .vp-stats-row { grid-template-columns: 1fr 1fr; }
    .vp-field-row { grid-template-columns: 1fr; }
  }
`;

function VariantPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [variants, setVariants] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
    const [showModal, setShowModal] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    const [formData, setFormData] = useState({ product: "", size: "M", price: "", is_active: true });

    const toNumber = (value, fallback = 0) => {
        const num = Number(value);
        return Number.isFinite(num) ? num : fallback;
    };

    const loadProducts = async () => {
        try {
            const productRes = await getProducts({ ordering: "name" });
            setProducts(productRes.data || []);
        } catch (error) {
            setErrorMessage(error.message || "Không thể tải sản phẩm");
        }
    };

    const loadVariants = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const variantRes = await getVariants({ ordering: "-created_at", keyword: searchTerm, page: currentPage });
            const variantList = variantRes.data || [];
            setVariants(variantList);
            const rawPagination = variantRes.pagination || {};
            const totalPages = Math.max(
                1,
                toNumber(rawPagination.total_pages) || toNumber(rawPagination.pages) || toNumber(rawPagination.last_page) || 1
            );
            const totalItems = toNumber(rawPagination.total) || toNumber(rawPagination.count) || variantList.length;
            setPagination({ totalPages, totalItems });
        } catch (error) {
            setErrorMessage(error.message || "Không thể tải biến thể");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadProducts(); }, []);
    useEffect(() => { loadVariants(); }, [searchTerm, currentPage]);

    const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), pagination.totalPages));

    const openAddModal = () => {
        setEditingVariant(null);
        setFormData({ product: products[0]?.id ? String(products[0].id) : "", size: "M", price: "", is_active: true });
        setShowModal(true);
    };

    const openEditModal = (variant) => {
        setEditingVariant(variant);
        setFormData({ product: String(variant.product), size: variant.size, price: variant.price, is_active: Boolean(variant.is_active) });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            product: Number(formData.product),
            size: formData.size,
            price: String(formData.price),
            is_active: Boolean(formData.is_active),
        };
        if (!payload.product || !payload.price) { setErrorMessage("Vui lòng chọn sản phẩm và nhập giá"); return; }
        setIsSubmitting(true); setErrorMessage("");
        try {
            if (editingVariant) await updateVariant(editingVariant.id, payload, "PATCH");
            else await createVariant(payload);
            setShowModal(false);
            await loadVariants();
        } catch (error) {
            setErrorMessage(error.message || "Không thể lưu biến thể");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa biến thể này?")) return;
        try {
            await deleteVariant(id);
            await loadVariants();
        } catch (error) {
            setErrorMessage(error.message || "Không thể xóa biến thể");
        }
    };

    const toggleStatus = async (variant) => {
        try {
            await updateVariant(variant.id, { is_active: !variant.is_active }, "PATCH");
            await loadVariants();
        } catch (error) {
            setErrorMessage(error.message || "Không thể cập nhật trạng thái");
        }
    };

    const statsData = [
        { label: "Tổng biến thể", value: pagination.totalItems, icon: <Layers size={18} />, iconBg: "#eef2ff", iconColor: "#6366f1", numColor: "#6366f1" },
        { label: "Đang bán", value: variants.filter(v => v.is_active).length, icon: <CheckCircle size={18} />, iconBg: "#ecfdf5", iconColor: "#059669", numColor: "#059669" },
        { label: "Tạm dừng", value: variants.filter(v => !v.is_active).length, icon: <PauseCircle size={18} />, iconBg: "#fffbeb", iconColor: "#b45309", numColor: "#b45309" },
        {
            label: "Giá trung bình",
            value: variants.length
                ? Math.round(variants.reduce((s, v) => s + Number(v.price || 0), 0) / variants.length).toLocaleString("vi-VN") + "đ"
                : "—",
            icon: <DollarSign size={18} />, iconBg: "#fff1f2", iconColor: "#e11d48", numColor: "#e11d48",
        },
    ];

    return (
        <>
            <style>{innerStyles}</style>

            {/* ── GIỮ NGUYÊN CẤU TRÚC GỐC ── */}
            <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
                <Sidebar />

                <div className="main-content p-4 vp-scope">

                    {/* NAV */}
                    <nav className="d-flex justify-content-between align-items-center mb-4">
                        <div className="vp-search-wrap">
                            <Search size={16} />
                            <input
                                className="vp-search-input"
                                type="text"
                                placeholder="Tìm kiếm biến thể..."
                                value={searchTerm}
                                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button className="vp-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
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
                            <h2 className="vp-page-title">Quản lý Biến thể</h2>
                            <p className="vp-page-sub">Size và giá bán của từng món ăn</p>
                        </header>

                        {errorMessage && (
                            <div className="vp-error">
                                <X size={14} style={{ flexShrink: 0 }} />
                                {errorMessage}
                            </div>
                        )}

                        {/* STATS */}
                        <div className="vp-stats-row">
                            {statsData.map(({ label, value, icon, iconBg, iconColor, numColor }) => (
                                <div className="vp-stat" key={label}>
                                    <div className="vp-stat-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
                                    <div>
                                        <div className="vp-stat-num" style={{ color: numColor, fontSize: typeof value === "string" ? "16px" : undefined }}>{value}</div>
                                        <div className="vp-stat-lbl">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TABLE CARD */}
                        <div className="vp-main-card">
                            <div className="vp-card-top">
                                <div className="d-flex align-items-center">
                                    <span className="vp-card-title">Danh sách biến thể</span>
                                    <span className="vp-card-count">{pagination.totalItems} biến thể</span>
                                </div>
                                <button className="vp-btn-add" onClick={openAddModal}>
                                    <Plus size={14} /> Thêm biến thể
                                </button>
                            </div>

                            <table className="vp-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Size</th>
                                        <th>Giá bán</th>
                                        <th style={{ textAlign: "center" }}>Trạng thái</th>
                                        <th style={{ textAlign: "right" }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr className="vp-loader-row">
                                            <td colSpan={5}>
                                                <span className="vp-spinner" />
                                                Đang tải biến thể...
                                            </td>
                                        </tr>
                                    ) : variants.length === 0 ? (
                                        <tr className="vp-empty-row">
                                            <td colSpan={5}>Không có biến thể trong trang này.</td>
                                        </tr>
                                    ) : (
                                        variants.map((variant) => {
                                            const size = variant.size_display || variant.size;
                                            const sizeStyle = SIZE_STYLE[variant.size] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
                                            const isActive = Boolean(variant.is_active);
                                            return (
                                                <tr key={variant.id}>
                                                    <td>
                                                        <span className="vp-product-name">{variant.product_name}</span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="vp-size-badge"
                                                            style={{ background: sizeStyle.bg, color: sizeStyle.color, borderColor: sizeStyle.border }}
                                                        >
                                                            {size}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="vp-price">
                                                            {Number(variant.price || 0).toLocaleString("vi-VN")}
                                                            <span className="vp-price-sub"> vnđ</span>
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <span
                                                            className="vp-status-pill"
                                                            style={isActive
                                                                ? { background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }
                                                                : { background: "#f3f4f6", color: "#6b7280", borderColor: "#e5e7eb" }
                                                            }
                                                        >
                                                            <span className="vp-status-dot" style={{ background: isActive ? "#10b981" : "#9ca3af" }} />
                                                            {isActive ? "Đang bán" : "Tạm dừng"}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <button className="vp-action-btn toggle me-1" onClick={() => toggleStatus(variant)} title="Đổi trạng thái">
                                                            <RefreshCw size={11} />
                                                        </button>
                                                        <button className="vp-action-btn edit me-1" onClick={() => openEditModal(variant)}>
                                                            <Edit3 size={11} /> Sửa
                                                        </button>
                                                        <button className="vp-action-btn del" onClick={() => handleDelete(variant.id)}>
                                                            <Trash2 size={11} /> Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>

                            {/* PAGINATION */}
                            <div className="vp-footer">
                                <span className="vp-pg-info">
                                    Trang {currentPage}/{pagination.totalPages} · {pagination.totalItems} biến thể
                                </span>
                                <div className="vp-pg-btns">
                                    <button className="vp-pg-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1 || isLoading}>
                                        <ChevronLeft size={14} />
                                    </button>
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                                        .map((page, index, arr) => {
                                            const prevPage = arr[index - 1];
                                            return (
                                                <React.Fragment key={`vpg-${page}`}>
                                                    {prevPage && page - prevPage > 1 && <button className="vp-pg-btn" disabled>···</button>}
                                                    <button
                                                        className={`vp-pg-btn ${page === currentPage ? "active" : ""}`}
                                                        onClick={() => goToPage(page)}
                                                        disabled={isLoading}
                                                    >
                                                        {page}
                                                    </button>
                                                </React.Fragment>
                                            );
                                        })}
                                    <button className="vp-pg-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pagination.totalPages || isLoading}>
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
                <div className="vp-overlay vp-scope" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="vp-modal">
                        <div className="vp-modal-header">
                            <span className="vp-modal-title">
                                {editingVariant ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}
                            </span>
                            <button className="vp-modal-close" onClick={() => setShowModal(false)}>
                                <X size={14} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="vp-modal-body">
                                {/* Sản phẩm */}
                                <div className="vp-field">
                                    <label>Sản phẩm</label>
                                    <div className="vp-select-wrap">
                                        <select name="product" value={formData.product} onChange={handleInputChange} required>
                                            <option value="">Chọn sản phẩm</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Size picker */}
                                <div className="vp-field">
                                    <label>Size</label>
                                    <div className="vp-size-picker">
                                        {SIZE_OPTIONS.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                className={`vp-size-opt ${formData.size === size ? "active" : ""}`}
                                                onClick={() => setFormData(prev => ({ ...prev, size }))}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Giá */}
                                <div className="vp-field">
                                    <label>Giá bán</label>
                                    <div className="vp-price-input-wrap">
                                        <input
                                            type="number" name="price" value={formData.price}
                                            onChange={handleInputChange} placeholder="VD: 45000" required min={0}
                                        />
                                        <span className="vp-price-suffix">đ</span>
                                    </div>
                                </div>

                                {/* Trạng thái */}
                                <div className="vp-field">
                                    <label>Trạng thái</label>
                                    <div className="vp-checkbox-row">
                                        <label className="vp-switch">
                                            <input
                                                type="checkbox" name="is_active"
                                                checked={formData.is_active} onChange={handleInputChange}
                                            />
                                            <span className="vp-slider" />
                                        </label>
                                        <span onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}>
                                            {formData.is_active ? "Đang bán" : "Tạm dừng"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="vp-modal-footer">
                                <button type="button" className="vp-btn-cancel" disabled={isSubmitting} onClick={() => setShowModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="vp-btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Đang lưu..." : editingVariant ? "Lưu thay đổi" : "Thêm biến thể"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default VariantPage;