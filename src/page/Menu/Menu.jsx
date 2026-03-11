import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon } from "lucide-react";
import "./Menu.css";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProductById,
  getProducts,
  updateProduct,
} from "../../api/menuApi";

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
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
    is_active: true,
  });

  const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const loadCategories = async () => {
    try {
      const categoryRes = await getCategories({ ordering: "name" });
      setCategories(categoryRes.data || []);
    } catch (error) {
      setErrorMessage(error.message || "Khong the tai danh muc");
    }
  };

  const loadFoods = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const params = {
        ordering: "-created_at",
        search: searchTerm,
        page: currentPage,
      };

      if (filterCategory !== "all") {
        params.category = filterCategory;
      }

      const productRes = await getProducts(params);
      const productList = productRes.data || [];
      setFoods(productList);

      const rawPagination = productRes.pagination || {};
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
        productList.length;
      setPagination({ totalPages, totalItems });

      if (!productList.some((item) => item.id === selectedFood?.id)) {
        setSelectedFood(productList[0] || null);
      }
    } catch (error) {
      setErrorMessage(error.message || "Khong the tai du lieu menu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadFoods();
  }, [filterCategory, searchTerm, currentPage]);

  useEffect(() => {
    const loadDetail = async () => {
      if (!selectedFood?.id) {
        setSelectedFoodDetail(null);
        return;
      }

      try {
        const detail = await getProductById(selectedFood.id);
        setSelectedFoodDetail(detail);
      } catch (error) {
        console.error("Loi tai chi tiet mon:", error);
        setSelectedFoodDetail(null);
      }
    };

    loadDetail();
  }, [selectedFood?.id]);

  const categoryOptions = useMemo(() => {
    return [{ id: "all", name: "Tất cả" }, ...categories];
  }, [categories]);

  const goToPage = (page) => {
    const safePage = Math.min(Math.max(1, page), pagination.totalPages);
    setCurrentPage(safePage);
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <span className="badge bg-success">Còn bán</span>;
    }
    return <span className="badge bg-secondary">Tạm dừng</span>;
  };

  const openAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: "",
      category: categories[0]?.id ? String(categories[0].id) : "",
      description: "",
      image_url: "",
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name || "",
      category: String(food.category || ""),
      description: food.description || "",
      image_url: food.image_url || "",
      is_active: Boolean(food.is_active),
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
      category: Number(formData.category),
      name: formData.name.trim(),
      description: formData.description.trim(),
      image_url: formData.image_url.trim(),
      is_active: Boolean(formData.is_active),
    };

    if (!payload.category || !payload.name) {
      setErrorMessage("Vui lòng nhập tên món và chọn danh mục");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      if (editingFood) {
        await updateProduct(editingFood.id, payload, "PATCH");
      } else {
        await createProduct(payload);
      }
      setShowModal(false);
      await loadFoods();
    } catch (error) {
      setErrorMessage(error.message || "Khong the luu mon an");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa món ăn này?")) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadFoods();
    } catch (error) {
      setErrorMessage(error.message || "Khong the xoa mon an");
    }
  };

  const toggleStatus = async (food) => {
    try {
      await updateProduct(food.id, { is_active: !food.is_active }, "PATCH");
      await loadFoods();
    } catch (error) {
      setErrorMessage(error.message || "Khong the cap nhat trang thai");
    }
  };

  const selectedImage =
    selectedFoodDetail?.image_url ||
    selectedFood?.image_url ||
    "https://via.placeholder.com/600x400?text=No+Image";

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
              placeholder="Tìm kiếm menu..."
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
            <h2 className="fw-bold">Quản lý Menu</h2>
            <p className="text-muted">Danh sách các món ăn và đồ uống</p>
          </header>

          <div className="mb-4 d-flex gap-2 flex-wrap">
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setCurrentPage(1);
                  setFilterCategory(String(category.id));
                }}
                className={`btn ${
                  String(filterCategory) === String(category.id)
                    ? "btn-success"
                    : "btn-outline-secondary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-muted mb-3">Dang tai menu...</div>
          ) : null}
          {errorMessage ? (
            <div className="alert alert-danger py-2">{errorMessage}</div>
          ) : null}

          <div className="row">
            <div className="col-xl-8">
              <div className="card shadow-sm">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="fw-bold mb-0">Danh sách món ăn</h5>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={openAddModal}
                    >
                      + Thêm món ăn
                    </button>
                  </div>

                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Món ăn</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                        <th className="text-end">Thao tác</th>
                      </tr>
                    </thead>

                    <tbody>
                      {foods.map((food) => (
                        <tr
                          key={food.id}
                          onClick={() => setSelectedFood(food)}
                          className={`clickable-row ${
                            selectedFood?.id === food.id ? "selected" : ""
                          }`}
                        >
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={
                                  food.image_url ||
                                  "https://via.placeholder.com/50x50?text=Food"
                                }
                                alt={food.name}
                                width="50"
                                height="50"
                                className="rounded"
                              />
                              <span className="fw-semibold">{food.name}</span>
                            </div>
                          </td>

                          <td>{food.category_name}</td>

                          <td>{getStatusBadge(food.is_active)}</td>

                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-warning me-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStatus(food);
                              }}
                            >
                              Đổi trạng thái
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(food);
                              }}
                            >
                              Sửa
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(food.id);
                              }}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!isLoading && foods.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center text-muted py-4"
                          >
                            Không có món trong trang này.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <small className="text-muted">
                    Trang {currentPage}/{pagination.totalPages} - Tổng{" "}
                    {pagination.totalItems} món
                  </small>

                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Phân trang món ăn"
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
                          <React.Fragment key={`menu-page-${page}`}>
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
                      disabled={
                        currentPage >= pagination.totalPages || isLoading
                      }
                    >
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              {selectedFood ? (
                <div className="card shadow-sm">
                  <img
                    src={selectedImage}
                    alt={selectedFood.name}
                    className="card-img-top"
                    style={{ height: "250px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h5 className="fw-bold">{selectedFood.name}</h5>
                    <p className="text-muted mb-2">
                      {selectedFood.category_name}
                    </p>
                    <div className="mb-3">
                      {getStatusBadge(selectedFood.is_active)}
                    </div>
                    <p className="text-muted">
                      {selectedFood.description || "Khong co mo ta"}
                    </p>

                    <hr />
                    <h6 className="fw-bold mb-2">Variants</h6>
                    {selectedFoodDetail?.variants?.length ? (
                      <ul className="mb-0 ps-3">
                        {selectedFoodDetail.variants.map((variant) => (
                          <li key={variant.id}>
                            {variant.size_display || variant.size}:{" "}
                            {Number(variant.price || 0).toLocaleString("vi-VN")}
                            đ
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted mb-0">Chua co variant</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingFood ? "Sửa món ăn" : "Thêm món ăn mới"}
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
                    <label className="form-label">Tên món ăn</label>
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
                    <label className="form-label">Danh mục</label>
                    <select
                      className="form-control"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL hình ảnh</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://..."
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
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Dang luu..."
                      : editingFood
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

export default FoodManagement;
