import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import {
    Search, Sun, Moon, Plus, Edit3, Trash2, X,
    ChevronLeft, ChevronRight, RefreshCw,
    UtensilsCrossed, CheckCircle, PauseCircle, Tag,
} from "lucide-react";
import {
    createProduct,
    deleteProduct,
    getCategories,
    getProductById,
    getProducts,
    updateProduct,
} from "../../api/menuApi";

const SIZE_STYLE = {
    S: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    M: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    L: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    XL: { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
};

const innerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

  .fm2-scope { font-family: 'Be Vietnam Pro', sans-serif; }

  .fm2-page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.3px; }
  .fm2-page-sub   { font-size: 13px; color: #9ca3af; margin: 2px 0 0; }

  .fm2-toggle-btn {
    width: 36px; height: 36px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #f9fafb; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; transition: all .15s; flex-shrink: 0;
  }
  .fm2-toggle-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }

  /* ERROR */
  .fm2-error {
    display: flex; align-items: center; gap: 8px;
    background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
    padding: 10px 14px; color: #dc2626; font-size: 13px; margin-bottom: 16px;
  }

  /* STATS */
  .fm2-stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
  .fm2-stat {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 14px;
    padding: 15px 18px; display: flex; align-items: center; gap: 12px;
    transition: border-color .2s, box-shadow .2s;
  }
  .fm2-stat:hover { border-color: #e0e7ff; box-shadow: 0 4px 16px rgba(99,102,241,0.07); }
  .fm2-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .fm2-stat-num  { font-size: 22px; font-weight: 700; line-height: 1; color: #111827; }
  .fm2-stat-lbl  { font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }

  /* CATEGORY TABS */
  .fm2-cat-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .fm2-cat-tab {
    padding: 6px 16px; border-radius: 20px; border: 1.5px solid #e5e7eb;
    background: #f9fafb; color: #6b7280;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .fm2-cat-tab:hover  { border-color: #a5b4fc; color: #4f46e5; background: #eef2ff; }
  .fm2-cat-tab.active { background: #6366f1; border-color: #6366f1; color: #fff; box-shadow: 0 2px 8px rgba(99,102,241,.25); }

  /* SEARCH */
  .fm2-search-wrap { position: relative; width: 320px; margin-bottom: 18px; }
  .fm2-search-wrap > svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
  .fm2-search-input {
    width: 100%; padding: 9px 14px 9px 38px;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif;
    background: #f9fafb; color: #111827; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .fm2-search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .fm2-search-input::placeholder { color: #d1d5db; }

  /* MAIN CARD */
  .fm2-main-card { background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.05); }
  .fm2-card-top  { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f3f4f6; }
  .fm2-card-title { font-size: 15px; font-weight: 600; color: #111827; }
  .fm2-card-count { font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 2px 10px; border-radius: 20px; margin-left: 8px; font-weight: 500; }

  .fm2-btn-add {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; background: #6366f1; color: #fff;
    border: none; border-radius: 10px;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: background .15s, box-shadow .15s, transform .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,0.25);
  }
  .fm2-btn-add:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
  .fm2-btn-add:active { transform: translateY(0); }

  /* TABLE */
  .fm2-table { width: 100%; border-collapse: collapse; }
  .fm2-table thead tr { background: #f9fafb; }
  .fm2-table th {
    padding: 10px 14px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .05em; color: #6b7280;
    border-bottom: 1px solid #f3f4f6; white-space: nowrap;
  }
  .fm2-table td {
    padding: 11px 14px; font-size: 13px; color: #374151;
    border-bottom: 1px solid #f9fafb; vertical-align: middle; transition: background .1s;
  }
  .fm2-table tbody tr { cursor: pointer; }
  .fm2-table tbody tr:hover td { background: #fafafa; }
  .fm2-table tbody tr.selected td { background: #eef2ff; }
  .fm2-table tbody tr:last-child td { border-bottom: none; }

  .fm2-food-img {
    width: 44px; height: 44px; border-radius: 10px; object-fit: cover;
    border: 1px solid #f3f4f6; flex-shrink: 0;
  }
  .fm2-food-name { font-weight: 600; color: #111827; font-size: 13.5px; }
  .fm2-cat-label { font-size: 12px; color: #6b7280; }

  .fm2-status-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid;
  }
  .fm2-status-dot { width: 5px; height: 5px; border-radius: 50%; }

  .fm2-action-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 10px; border-radius: 7px; border: 1.5px solid #e5e7eb; background: #f9fafb;
    font-size: 12px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    color: #6b7280; cursor: pointer; transition: all .15s;
  }
  .fm2-action-btn.toggle:hover { border-color: #f59e0b; background: #fffbeb; color: #b45309; }
  .fm2-action-btn.edit:hover   { border-color: #6366f1; background: #eef2ff; color: #6366f1; }
  .fm2-action-btn.del:hover    { border-color: #ef4444; background: #fef2f2; color: #ef4444; }

  /* LOADER / EMPTY */
  .fm2-loader-row td, .fm2-empty-row td { text-align: center; padding: 40px 0 !important; color: #9ca3af; }
  .fm2-spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin .65s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* FOOTER */
  .fm2-footer { padding: 12px 20px; border-top: 1px solid #f3f4f6; background: #fafafa; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .fm2-pg-info { font-size: 12px; color: #9ca3af; }
  .fm2-pg-btns { display: flex; gap: 5px; }
  .fm2-pg-btn {
    min-width: 30px; height: 30px; padding: 0 7px;
    border: 1.5px solid #e5e7eb; border-radius: 7px;
    background: #fff; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif;
    cursor: pointer; transition: all .15s;
  }
  .fm2-pg-btn:hover:not(:disabled) { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
  .fm2-pg-btn.active { background: #6366f1; border-color: #6366f1; color: #fff; }
  .fm2-pg-btn:disabled { opacity: .38; cursor: not-allowed; }

  /* DETAIL PANEL */
  .fm2-detail-card {
    background: #fff; border: 1.5px solid #f3f4f6; border-radius: 18px;
    overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.05);
    position: sticky; top: 16px;
  }
  .fm2-detail-img {
    width: 100%; height: 200px; object-fit: cover;
    border-bottom: 1px solid #f3f4f6;
    background: #f9fafb;
  }
  .fm2-detail-img-placeholder {
    width: 100%; height: 200px; background: linear-gradient(135deg,#f3f4f6,#e5e7eb);
    display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid #f3f4f6; color: #d1d5db; font-size: 40px;
  }
  .fm2-detail-body { padding: 18px 20px; }
  .fm2-detail-name { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px; letter-spacing: -0.2px; }
  .fm2-detail-cat  { font-size: 13px; color: #9ca3af; margin-bottom: 10px; }
  .fm2-detail-desc { font-size: 13px; color: #6b7280; line-height: 1.6; margin-bottom: 14px; }

  .fm2-divider { height: 1px; background: #f3f4f6; margin: 14px 0; }
  .fm2-variants-title { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 10px; }
  .fm2-variants-list  { display: flex; flex-direction: column; gap: 7px; }
  .fm2-variant-row {
    display: flex; align-items: center; justify-content: space-between;
    background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 9px; padding: 9px 12px;
  }
  .fm2-variant-size {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 7px; font-size: 12px; font-weight: 700; border: 1px solid;
  }
  .fm2-variant-price { font-size: 14px; font-weight: 600; color: #059669; }
  .fm2-variant-price-sub { font-size: 11px; color: #9ca3af; font-weight: 400; }

  .fm2-empty-select { text-align: center; padding: 40px 20px; color: #9ca3af; font-size: 13px; }
  .fm2-empty-select-icon { font-size: 32px; margin-bottom: 10px; opacity: .4; }

  /* MODAL */
  .fm2-overlay {
    position: fixed; inset: 0; background: rgba(17,24,39,0.45); backdrop-filter: blur(4px);
    z-index: 1050; display: flex; align-items: center; justify-content: center;
    animation: fadeOv .18s ease; padding: 16px;
  }
  @keyframes fadeOv { from { opacity: 0; } to { opacity: 1; } }
  .fm2-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 500px;
    box-shadow: 0 20px 60px rgba(17,24,39,0.18);
    animation: modalUp .22s cubic-bezier(.34,1.56,.64,1) both; overflow: hidden;
    max-height: 90vh; display: flex; flex-direction: column;
  }
  @keyframes modalUp { from { opacity: 0; transform: translateY(20px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .fm2-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #f3f4f6; flex-shrink: 0; }
  .fm2-modal-title  { font-size: 17px; font-weight: 700; color: #111827; }
  .fm2-modal-close  {
    width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #f9fafb; color: #9ca3af;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s;
  }
  .fm2-modal-close:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

  .fm2-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; }
  .fm2-field label { display: block; font-size: 11.5px; font-weight: 600; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
  .fm2-field input, .fm2-field select, .fm2-field textarea {
    width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 9px;
    font-size: 13.5px; font-family: 'Be Vietnam Pro', sans-serif; color: #111827;
    background: #f9fafb; outline: none; resize: vertical;
    transition: border-color .2s, box-shadow .2s, background .2s;
    -webkit-appearance: none; appearance: none;
  }
  .fm2-field input:focus, .fm2-field select:focus, .fm2-field textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); background: #fff; }
  .fm2-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* Image preview */
  .fm2-img-preview {
    width: 100%; height: 120px; border-radius: 10px; object-fit: cover;
    border: 1px solid #e5e7eb; margin-top: 8px;
    display: block;
  }
  .fm2-img-placeholder {
    width: 100%; height: 80px; border-radius: 10px;
    background: #f3f4f6; border: 1.5px dashed #d1d5db;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af; font-size: 12px; margin-top: 6px;
  }

  .fm2-select-wrap { position: relative; }
  .fm2-select-wrap::after { content: '▾'; position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; font-size: 12px; }
  .fm2-select-wrap select { padding-right: 28px; }

  .fm2-checkbox-row { display: flex; align-items: center; gap: 10px; }
  .fm2-switch { position: relative; display: inline-block; width: 38px; height: 21px; }
  .fm2-switch input { opacity: 0; width: 0; height: 0; }
  .fm2-slider { position: absolute; inset: 0; cursor: pointer; background: #e5e7eb; border-radius: 21px; transition: background .2s; }
  .fm2-slider::before { content: ''; position: absolute; width: 15px; height: 15px; border-radius: 50%; background: #fff; left: 3px; top: 3px; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
  .fm2-switch input:checked + .fm2-slider { background: #6366f1; }
  .fm2-switch input:checked + .fm2-slider::before { transform: translateX(17px); }
  .fm2-checkbox-row span { font-size: 13.5px; color: #374151; font-weight: 500; cursor: pointer; }

  .fm2-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #f3f4f6; background: #fafafa; flex-shrink: 0; }
  .fm2-btn-cancel {
    padding: 8px 20px; border-radius: 9px; border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
  }
  .fm2-btn-cancel:hover:not(:disabled) { border-color: #9ca3af; color: #374151; }
  .fm2-btn-submit {
    padding: 8px 24px; border-radius: 9px; background: #6366f1; border: none; color: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Be Vietnam Pro', sans-serif; cursor: pointer; transition: all .15s;
    box-shadow: 0 2px 8px rgba(99,102,241,.25);
  }
  .fm2-btn-submit:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,.35); }
  .fm2-btn-cancel:disabled, .fm2-btn-submit:disabled { opacity: .5; cursor: not-allowed; }

  @media (max-width: 1200px) { .fm2-stats-row { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 768px)  { .fm2-stats-row { grid-template-columns: 1fr 1fr; } .fm2-search-wrap { width: 100%; } .fm2-field-row { grid-template-columns: 1fr; } }
`;

function FoodManagement() {
    const [darkMode, setDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [selectedFoodDetail, setSelectedFoodDetail] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filterCategory, setFilterCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

    const [formData, setFormData] = useState({ name: "", category: "", description: "", image_url: "", is_active: true });

    const toNumber = (value, fallback = 0) => { const n = Number(value); return Number.isFinite(n) ? n : fallback; };

    const loadCategories = async () => {
        try {
            const categoryRes = await getCategories({ ordering: "name" });
            setCategories(categoryRes.data || []);
        } catch (error) {
            setErrorMessage(error.message || "Không thể tải danh mục");
        }
    };

    const loadFoods = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const params = { ordering: "-created_at", keyword: searchTerm, page: currentPage };
            if (filterCategory !== "all") params.category = filterCategory;
            const productRes = await getProducts(params);
            const productList = productRes.data || [];
            setFoods(productList);
            const rawPagination = productRes.pagination || {};
            const totalPages = Math.max(1, toNumber(rawPagination.total_pages) || toNumber(rawPagination.pages) || toNumber(rawPagination.last_page) || 1);
            const totalItems = toNumber(rawPagination.total) || toNumber(rawPagination.count) || productList.length;
            setPagination({ totalPages, totalItems });
            if (!productList.some(item => item.id === selectedFood?.id)) setSelectedFood(productList[0] || null);
        } catch (error) {
            setErrorMessage(error.message || "Không thể tải danh sách món");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadCategories(); }, []);
    useEffect(() => { loadFoods(); }, [filterCategory, searchTerm, currentPage]);

    useEffect(() => {
        const loadDetail = async () => {
            if (!selectedFood?.id) { setSelectedFoodDetail(null); return; }
            try { const detail = await getProductById(selectedFood.id); setSelectedFoodDetail(detail); }
            catch { setSelectedFoodDetail(null); }
        };
        loadDetail();
    }, [selectedFood?.id]);

    const categoryOptions = useMemo(() => [{ id: "all", name: "Tất cả" }, ...categories], [categories]);
    const goToPage = (page) => setCurrentPage(Math.min(Math.max(1, page), pagination.totalPages));

    const openAddModal = () => {
        setEditingFood(null);
        setFormData({ name: "", category: categories[0]?.id ? String(categories[0].id) : "", description: "", image_url: "", is_active: true });
        setShowModal(true);
    };

    const openEditModal = (food) => {
        setEditingFood(food);
        setFormData({ name: food.name || "", category: String(food.category || ""), description: food.description || "", image_url: food.image_url || "", is_active: Boolean(food.is_active) });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { category: Number(formData.category), name: formData.name.trim(), description: formData.description.trim(), image_url: formData.image_url.trim(), is_active: Boolean(formData.is_active) };
        if (!payload.category || !payload.name) { setErrorMessage("Vui lòng nhập tên món và chọn danh mục"); return; }
        setIsSubmitting(true); setErrorMessage("");
        try {
            if (editingFood) await updateProduct(editingFood.id, payload, "PATCH");
            else await createProduct(payload);
            setShowModal(false);
            await loadFoods();
        } catch (error) {
            setErrorMessage(error.message || "Không thể lưu món ăn");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa món ăn này?")) return;
        try { await deleteProduct(id); await loadFoods(); }
        catch (error) { setErrorMessage(error.message || "Không thể xóa món ăn"); }
    };

    const toggleStatus = async (food) => {
        try { await updateProduct(food.id, { is_active: !food.is_active }, "PATCH"); await loadFoods(); }
        catch (error) { setErrorMessage(error.message || "Không thể cập nhật trạng thái"); }
    };

    const selectedImage = selectedFoodDetail?.image_url || selectedFood?.image_url || "";

    const statsData = [
        { label: "Tổng món ăn", value: pagination.totalItems, icon: <UtensilsCrossed size={18} />, iconBg: "#eef2ff", iconColor: "#6366f1", numColor: "#6366f1" },
        { label: "Đang bán", value: foods.filter(f => f.is_active).length, icon: <CheckCircle size={18} />, iconBg: "#ecfdf5", iconColor: "#059669", numColor: "#059669" },
        { label: "Tạm dừng", value: foods.filter(f => !f.is_active).length, icon: <PauseCircle size={18} />, iconBg: "#fffbeb", iconColor: "#b45309", numColor: "#b45309" },
        { label: "Danh mục", value: categories.length, icon: <Tag size={18} />, iconBg: "#fff1f2", iconColor: "#e11d48", numColor: "#e11d48" },
    ];

    return (
        <>
            <style>{innerStyles}</style>

            <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
                <Sidebar />

                <div className="main-content p-4 fm2-scope">

                    {/* NAV */}
                    <nav className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fm2-page-title">Quản lý Menu</h2>
                            <p className="fm2-page-sub">Danh sách các món ăn và đồ uống</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button className="fm2-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                            <div className="rounded-circle" style={{ width: 36, height: 36, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", flexShrink: 0 }} />
                        </div>
                    </nav>

                    {errorMessage && (
                        <div className="fm2-error">
                            <X size={14} style={{ flexShrink: 0 }} />
                            {errorMessage}
                            <button style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 0 }} onClick={() => setErrorMessage("")}>
                                <X size={13} />
                            </button>
                        </div>
                    )}

                    {/* STATS */}
                    <div className="fm2-stats-row">
                        {statsData.map(({ label, value, icon, iconBg, iconColor, numColor }) => (
                            <div className="fm2-stat" key={label}>
                                <div className="fm2-stat-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
                                <div>
                                    <div className="fm2-stat-num" style={{ color: numColor }}>{value}</div>
                                    <div className="fm2-stat-lbl">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CATEGORY TABS */}
                    <div className="fm2-cat-tabs">
                        {categoryOptions.map(cat => (
                            <button
                                key={cat.id}
                                className={`fm2-cat-tab ${String(filterCategory) === String(cat.id) ? "active" : ""}`}
                                onClick={() => { setCurrentPage(1); setFilterCategory(String(cat.id)); }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* SEARCH */}
                    <div className="fm2-search-wrap">
                        <Search size={15} />
                        <input
                            className="fm2-search-input"
                            type="text"
                            placeholder="Tìm kiếm món ăn..."
                            value={searchTerm}
                            onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value); }}
                        />
                    </div>

                    <div className="row g-3">
                        {/* TABLE */}
                        <div className="col-xl-8">
                            <div className="fm2-main-card">
                                <div className="fm2-card-top">
                                    <div className="d-flex align-items-center">
                                        <span className="fm2-card-title">Danh sách món ăn</span>
                                        <span className="fm2-card-count">{pagination.totalItems} món</span>
                                    </div>
                                    <button className="fm2-btn-add" onClick={openAddModal}>
                                        <Plus size={14} /> Thêm món ăn
                                    </button>
                                </div>

                                <table className="fm2-table">
                                    <thead>
                                        <tr>
                                            <th>Món ăn</th>
                                            <th>Danh mục</th>
                                            <th style={{ textAlign: "center" }}>Trạng thái</th>
                                            <th style={{ textAlign: "right" }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr className="fm2-loader-row">
                                                <td colSpan={4}><span className="fm2-spinner" />Đang tải menu...</td>
                                            </tr>
                                        ) : foods.length === 0 ? (
                                            <tr className="fm2-empty-row">
                                                <td colSpan={4}>Không có món trong trang này.</td>
                                            </tr>
                                        ) : (
                                            foods.map(food => (
                                                <tr
                                                    key={food.id}
                                                    className={selectedFood?.id === food.id ? "selected" : ""}
                                                    onClick={() => setSelectedFood(food)}
                                                >
                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <img
                                                                className="fm2-food-img"
                                                                src={food.image_url || "https://via.placeholder.com/44x44?text=🍽"}
                                                                alt={food.name}
                                                                onError={e => { e.target.src = "https://via.placeholder.com/44x44?text=🍽"; }}
                                                            />
                                                            <span className="fm2-food-name">{food.name}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className="fm2-cat-label">{food.category_name}</span></td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {food.is_active ? (
                                                            <span className="fm2-status-pill" style={{ background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }}>
                                                                <span className="fm2-status-dot" style={{ background: "#10b981" }} />Còn bán
                                                            </span>
                                                        ) : (
                                                            <span className="fm2-status-pill" style={{ background: "#f3f4f6", color: "#6b7280", borderColor: "#e5e7eb" }}>
                                                                <span className="fm2-status-dot" style={{ background: "#9ca3af" }} />Tạm dừng
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <button className="fm2-action-btn toggle me-1" onClick={e => { e.stopPropagation(); toggleStatus(food); }} title="Đổi trạng thái">
                                                            <RefreshCw size={11} />
                                                        </button>
                                                        <button className="fm2-action-btn edit me-1" onClick={e => { e.stopPropagation(); openEditModal(food); }}>
                                                            <Edit3 size={11} /> Sửa
                                                        </button>
                                                        <button className="fm2-action-btn del" onClick={e => { e.stopPropagation(); handleDelete(food.id); }}>
                                                            <Trash2 size={11} /> Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                <div className="fm2-footer">
                                    <span className="fm2-pg-info">Trang {currentPage}/{pagination.totalPages} · {pagination.totalItems} món</span>
                                    <div className="fm2-pg-btns">
                                        <button className="fm2-pg-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1 || isLoading}>
                                            <ChevronLeft size={13} />
                                        </button>
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                                            .map((page, index, arr) => {
                                                const prevPage = arr[index - 1];
                                                return (
                                                    <React.Fragment key={`fpg-${page}`}>
                                                        {prevPage && page - prevPage > 1 && <button className="fm2-pg-btn" disabled>···</button>}
                                                        <button
                                                            className={`fm2-pg-btn ${page === currentPage ? "active" : ""}`}
                                                            onClick={() => goToPage(page)} disabled={isLoading}
                                                        >{page}</button>
                                                    </React.Fragment>
                                                );
                                            })}
                                        <button className="fm2-pg-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pagination.totalPages || isLoading}>
                                            <ChevronRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DETAIL PANEL */}
                        <div className="col-xl-4">
                            {selectedFood ? (
                                <div className="fm2-detail-card">
                                    {selectedImage ? (
                                        <img className="fm2-detail-img" src={selectedImage} alt={selectedFood.name} onError={e => { e.target.style.display = "none"; }} />
                                    ) : (
                                        <div className="fm2-detail-img-placeholder">🍽</div>
                                    )}
                                    <div className="fm2-detail-body">
                                        <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                                            <div className="fm2-detail-name">{selectedFood.name}</div>
                                            {selectedFood.is_active ? (
                                                <span className="fm2-status-pill" style={{ background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0", flexShrink: 0 }}>
                                                    <span className="fm2-status-dot" style={{ background: "#10b981" }} />Còn bán
                                                </span>
                                            ) : (
                                                <span className="fm2-status-pill" style={{ background: "#f3f4f6", color: "#6b7280", borderColor: "#e5e7eb", flexShrink: 0 }}>
                                                    <span className="fm2-status-dot" style={{ background: "#9ca3af" }} />Tạm dừng
                                                </span>
                                            )}
                                        </div>
                                        <div className="fm2-detail-cat">{selectedFood.category_name}</div>
                                        <div className="fm2-detail-desc">{selectedFood.description || "Chưa có mô tả."}</div>

                                        <div className="fm2-divider" />

                                        <div className="fm2-variants-title">
                                            Biến thể giá ({selectedFoodDetail?.variants?.length || 0})
                                        </div>

                                        {selectedFoodDetail?.variants?.length ? (
                                            <div className="fm2-variants-list">
                                                {selectedFoodDetail.variants.map(variant => {
                                                    const sz = SIZE_STYLE[variant.size] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
                                                    return (
                                                        <div className="fm2-variant-row" key={variant.id}>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="fm2-variant-size" style={{ background: sz.bg, color: sz.color, borderColor: sz.border }}>
                                                                    {variant.size_display || variant.size}
                                                                </span>
                                                                <span style={{ fontSize: 13, color: "#6b7280" }}>Size {variant.size_display || variant.size}</span>
                                                            </div>
                                                            <span className="fm2-variant-price">
                                                                {Number(variant.price || 0).toLocaleString("vi-VN")}
                                                                <span className="fm2-variant-price-sub">đ</span>
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, padding: "12px 0" }}>
                                                Chưa có biến thể.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="fm2-detail-card">
                                    <div className="fm2-empty-select">
                                        <div className="fm2-empty-select-icon">🍽</div>
                                        <p>Chọn một món ăn để xem chi tiết</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fm2-overlay fm2-scope" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="fm2-modal">
                        <div className="fm2-modal-header">
                            <span className="fm2-modal-title">{editingFood ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}</span>
                            <button className="fm2-modal-close" onClick={() => setShowModal(false)}><X size={14} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="fm2-modal-body">
                                <div className="fm2-field-row">
                                    <div className="fm2-field">
                                        <label>Tên món ăn</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="VD: Phở bò tái" required />
                                    </div>
                                    <div className="fm2-field">
                                        <label>Danh mục</label>
                                        <div className="fm2-select-wrap">
                                            <select name="category" value={formData.category} onChange={handleInputChange} required>
                                                <option value="">Chọn danh mục</option>
                                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="fm2-field">
                                    <label>Mô tả</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Mô tả ngắn về món ăn..." />
                                </div>

                                <div className="fm2-field">
                                    <label>URL hình ảnh</label>
                                    <input type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." />
                                    {formData.image_url ? (
                                        <img className="fm2-img-preview" src={formData.image_url} alt="preview" onError={e => { e.target.style.display = "none"; }} />
                                    ) : (
                                        <div className="fm2-img-placeholder">Nhập URL để xem preview</div>
                                    )}
                                </div>

                                <div className="fm2-field">
                                    <label>Trạng thái</label>
                                    <div className="fm2-checkbox-row">
                                        <label className="fm2-switch">
                                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                                            <span className="fm2-slider" />
                                        </label>
                                        <span onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}>
                                            {formData.is_active ? "Đang bán" : "Tạm dừng"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="fm2-modal-footer">
                                <button type="button" className="fm2-btn-cancel" disabled={isSubmitting} onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="fm2-btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Đang lưu..." : editingFood ? "Lưu thay đổi" : "Thêm món ăn"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default FoodManagement;