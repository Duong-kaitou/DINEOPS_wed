import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon } from "lucide-react";
import "./category.css";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/menuApi";

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
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
  });

  const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const loadCategories = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await getCategories({
        ordering: "name",
        search: searchTerm,
        page: currentPage,
      });
      setCategories(result.data || []);

      const rawPagination = result.pagination || {};
      const totalPages = Math.max(
        1,
        toNumber(rawPagination.total_pages) ||
          toNumber(rawPagination.pages) ||
          toNumber(rawPagination.last_page) ||
          1
      );
      const totalItems =
        toNumber(rawPagination.total) ||
        toNumber(rawPagination.count) ||
        (result.data || []).length;
      setPagination({ totalPages, totalItems });
    } catch (error) {
      setErrorMessage(error.message || "Khong the tai danh muc");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [searchTerm, currentPage]);

  const goToPage = (page) => {
    const safePage = Math.min(Math.max(1, page), pagination.totalPages);
    setCurrentPage(safePage);
  };

  const toggleStatus = async (category) => {
    try {
      await updateCategory(
        category.id,
        { is_active: !category.is_active },
        "PATCH"
      );
      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message || "Khong the cap nhat trang thai");
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", active: true });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      active: category.is_active,
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
      name: formData.name.trim(),
      description: formData.description.trim(),
      is_active: Boolean(formData.active),
    };

    if (!payload.name) {
      setErrorMessage("Ten danh muc khong duoc de trong");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload, "PATCH");
      } else {
        await createCategory(payload);
      }
      setShowModal(false);
      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message || "Khong the luu danh muc");
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
        setErrorMessage(error.message || "Khong the xoa danh muc");
      }
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
              placeholder="Tìm kiếm danh mục..."
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
            <h2 className="fw-bold">Quản lý Danh mục</h2>
            <p className="text-muted">Danh sách các danh mục món ăn</p>
          </header>

          {/* Statistics */}
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Tổng danh mục</h6>
                  <h4 className="fw-bold">{pagination.totalItems}</h4>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Hoạt động</h6>
                  <h4 className="fw-bold text-success">
                    {categories.filter((c) => c.is_active).length}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Tổng số món</h6>
                  <h4 className="fw-bold">
                    {categories.reduce(
                      (sum, cat) => sum + Number(cat.products_count || 0),
                      0
                    )}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Danh mục tạm dừng</h6>
                  <h4 className="fw-bold text-warning">
                    {categories.filter((c) => !c.is_active).length}
                  </h4>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-muted mb-3">Dang tai du lieu...</div>
            ) : null}
            {errorMessage ? (
              <div className="alert alert-danger py-2">{errorMessage}</div>
            ) : null}
          </div>

          {/* Table */}
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="fw-bold mb-0">Danh sách danh mục</h5>
                <button
                  className="btn btn-success btn-sm"
                  onClick={openAddModal}
                >
                  + Thêm danh mục
                </button>
              </div>

              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Tên danh mục</th>
                    <th>Mô tả</th>
                    <th className="text-center">Số món</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className={!cat.is_active ? "text-muted" : ""}
                    >
                      <td className="fw-semibold">{cat.name}</td>

                      <td>{cat.description}</td>

                      <td className="text-center">
                        <span className="badge bg-secondary">
                          {cat.products_count || 0}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="form-check form-switch d-inline-block">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={Boolean(cat.is_active)}
                            onChange={() => toggleStatus(cat)}
                          />
                        </div>
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEditModal(cat)}
                        >
                          Sửa
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        Không có danh mục trong trang này.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
              <small className="text-muted">
                Trang {currentPage}/{pagination.totalPages} - Tổng{" "}
                {pagination.totalItems} danh mục
              </small>

              <div
                className="btn-group"
                role="group"
                aria-label="Phân trang danh mục"
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                >
                  Trước
                </button>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, index) => index + 1
                )
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
                      <React.Fragment key={`cat-page-${page}`}>
                        {showDots ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            disabled
                          >
                            ...
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            page === currentPage
                              ? "btn-primary"
                              : "btn-outline-secondary"
                          }`}
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

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
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
                    <label className="form-label">Tên danh mục</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">Hoạt động</label>
                    </div>
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
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Dang luu..."
                      : editingCategory
                      ? "Cập nhật"
                      : "Thêm"}
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

export default CategoryManagement;
