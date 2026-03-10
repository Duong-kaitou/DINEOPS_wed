import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Moon, Search, Sun } from "lucide-react";
import {
    createVariant,
    deleteVariant,
    getProducts,
    getVariants,
    updateVariant,
} from "../../api/menuApi";

const SIZE_OPTIONS = ["S", "M", "L", "XL"];

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
    const [formData, setFormData] = useState({
        product: "",
        size: "M",
        price: "",
        is_active: true,
    });

    const toNumber = (value, fallback = 0) => {
        const num = Number(value);
        return Number.isFinite(num) ? num : fallback;
    };

    const loadProducts = async () => {
        try {
            const productRes = await getProducts({ ordering: "name" });
            setProducts(productRes.data || []);
        } catch (error) {
            setErrorMessage(error.message || "Khong the tai san pham");
        }
    };

    const loadVariants = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const variantRes = await getVariants({
                ordering: "-created_at",
                search: searchTerm,
                page: currentPage,
            });
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
            setErrorMessage(error.message || "Khong the tai variants");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        loadVariants();
    }, [searchTerm, currentPage]);

    const goToPage = (page) => {
        const safePage = Math.min(Math.max(1, page), pagination.totalPages);
        setCurrentPage(safePage);
    };

    const openAddModal = () => {
        setEditingVariant(null);
        setFormData({
            product: products[0]?.id ? String(products[0].id) : "",
            size: "M",
            price: "",
            is_active: true,
        });
        setShowModal(true);
    };

    const openEditModal = (variant) => {
        setEditingVariant(variant);
        setFormData({
            product: String(variant.product),
            size: variant.size,
            price: variant.price,
            is_active: Boolean(variant.is_active),
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            product: Number(formData.product),
            size: formData.size,
            price: String(formData.price),
            is_active: Boolean(formData.is_active),
        };

        if (!payload.product || !payload.price) {
            setErrorMessage("Vui long chon san pham va nhap gia");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        try {
            if (editingVariant) {
                await updateVariant(editingVariant.id, payload, "PATCH");
            } else {
                await createVariant(payload);
            }
            setShowModal(false);
            await loadVariants();
        } catch (error) {
            setErrorMessage(error.message || "Khong the luu variant");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa biến thể này?")) {
            return;
        }

        try {
            await deleteVariant(id);
            await loadVariants();
        } catch (error) {
            setErrorMessage(error.message || "Khong the xoa variant");
        }
    };

    const toggleStatus = async (variant) => {
        try {
            await updateVariant(variant.id, { is_active: !variant.is_active }, "PATCH");
            await loadVariants();
        } catch (error) {
            setErrorMessage(error.message || "Khong the cap nhat trang thai");
        }
    };

    return (
        <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
            <Sidebar />

            <div className="main-content p-4">
                <nav className="d-flex justify-content-between align-items-center mb-4">
                    <div
                        className="search-bar bg-white px-3 py-2 rounded-pill shadow-sm d-flex align-items-center"
                        style={{ width: "400px" }}
                    >
                        <Search size={18} className="text-secondary me-2" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm variant..."
                            className="border-0 w-100"
                            style={{ outline: "none" }}
                            value={searchTerm}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setSearchTerm(e.target.value);
                            }}
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
                        <h2 className="fw-bold">Quản lý Variants</h2>
                        <p className="text-muted">Size và giá của từng món</p>
                    </header>

                    {isLoading ? <div className="text-muted mb-3">Dang tai variants...</div> : null}
                    {errorMessage ? <div className="alert alert-danger py-2">{errorMessage}</div> : null}

                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                <h5 className="fw-bold mb-0">Danh sách variants</h5>
                                <button className="btn btn-success btn-sm" onClick={openAddModal}>
                                    + Thêm variant
                                </button>
                            </div>

                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Size</th>
                                        <th>Giá</th>
                                        <th>Trạng thái</th>
                                        <th className="text-end">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map((variant) => (
                                        <tr key={variant.id}>
                                            <td>{variant.product_name}</td>
                                            <td>{variant.size_display || variant.size}</td>
                                            <td>{Number(variant.price || 0).toLocaleString("vi-VN")}đ</td>
                                            <td>
                                                <span
                                                    className={`badge ${variant.is_active ? "bg-success" : "bg-secondary"}`}
                                                >
                                                    {variant.is_active ? "Hoạt động" : "Tạm dừng"}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-warning me-2"
                                                    onClick={() => toggleStatus(variant)}
                                                >
                                                    Đổi trạng thái
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => openEditModal(variant)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(variant.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!isLoading && variants.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-4">
                                                Không có biến thể trong trang này.
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>

                        <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <small className="text-muted">
                                Trang {currentPage}/{pagination.totalPages} - Tổng {pagination.totalItems} biến thể
                            </small>

                            <div className="btn-group" role="group" aria-label="Phân trang biến thể">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage <= 1 || isLoading}
                                >
                                    Trước
                                </button>
                                {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
                                    .filter(
                                        (page) =>
                                            page === 1 ||
                                            page === pagination.totalPages ||
                                            Math.abs(page - currentPage) <= 1
                                    )
                                    .map((page, index, arr) => {
                                        const prevPage = arr[index - 1];
                                        const showDots = prevPage && page - prevPage > 1;

                                        return (
                                            <React.Fragment key={`variant-page-${page}`}>
                                                {showDots ? (
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                                                        ...
                                                    </button>
                                                ) : null}
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-secondary"}`}
                                                    onClick={() => goToPage(page)}
                                                    disabled={isLoading}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage >= pagination.totalPages || isLoading}
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingVariant ? "Sửa variant" : "Thêm variant mới"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Sản phẩm</label>
                                        <select
                                            className="form-control"
                                            name="product"
                                            value={formData.product}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn sản phẩm</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Size</label>
                                        <select
                                            className="form-control"
                                            name="size"
                                            value={formData.size}
                                            onChange={handleInputChange}
                                        >
                                            {SIZE_OPTIONS.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giá</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label">Đang bán</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        disabled={isSubmitting}
                                        onClick={() => setShowModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                        {isSubmitting ? "Dang luu..." : editingVariant ? "Cập nhật" : "Thêm"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VariantPage;
