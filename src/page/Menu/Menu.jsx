import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon } from "lucide-react";

function FoodManagement() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const [foods, setFoods] = useState([
    {
      id: 1,
      name: "Phở Bò Đặc Biệt",
      category: "Món chính",
      price: 85000,
      status: "available",
      image:
        "https://th.bing.com/th/id/OIP.uWgHqhZ2cdghEl-qtju88gHaE8?w=288&h=192&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3",
    },
    {
      id: 2,
      name: "Trà Đào Cam Sả",
      category: "Đồ uống",
      price: 45000,
      status: "available",
      image:
        "https://th.bing.com/th/id/OIP.2eKh0qFqZc3x1K3x04qW7wHaHa?w=180&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3",
    },
    {
      id: 3,
      name: "Nem Rán Hà Nội",
      category: "Khai vị",
      price: 60000,
      status: "out",
      image:
        "data:image/webp;base64,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",
    },
  ]);

  const [selectedFood, setSelectedFood] = useState(foods[0]);
  const [formData, setFormData] = useState({
    name: "",
    category: "Món chính",
    price: 0,
    status: "available",
    image: "",
  });

  const [filterCategory, setFilterCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Món chính", "Đồ uống", "Khai vị"];

  const filteredFoods =
    filterCategory === "Tất cả"
      ? foods
      : foods.filter((food) => food.category === filterCategory);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const getStatusBadge = (status) => {
    if (status === "available") {
      return <span className="badge bg-success">Còn hàng</span>;
    }
    return <span className="badge bg-secondary">Hết hàng</span>;
  };

  const openAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: "",
      category: "Món chính",
      price: 0,
      status: "available",
      image: "",
    });
    setShowModal(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      category: food.category,
      price: food.price,
      status: food.status,
      image: food.image,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingFood) {
      // Sửa món ăn
      setFoods(
        foods.map((food) =>
          food.id === editingFood.id ? { ...food, ...formData } : food
        )
      );
      setSelectedFood((prev) =>
        prev.id === editingFood.id ? { ...prev, ...formData } : prev
      );
    } else {
      // Thêm món ăn mới
      const newFood = {
        id: Math.max(...foods.map((f) => f.id), 0) + 1,
        ...formData,
      };
      setFoods([...foods, newFood]);
      setSelectedFood(newFood);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa món ăn này?")) {
      const newFoods = foods.filter((food) => food.id !== id);
      setFoods(newFoods);
      if (selectedFood.id === id) {
        setSelectedFood(newFoods[0]);
      }
    }
  };

  const toggleStatus = (id) => {
    setFoods(
      foods.map((food) =>
        food.id === id
          ? {
              ...food,
              status: food.status === "available" ? "out" : "available",
            }
          : food
      )
    );
    if (selectedFood.id === id) {
      setSelectedFood((prev) => ({
        ...prev,
        status: prev.status === "available" ? "out" : "available",
      }));
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
              placeholder="Tìm kiếm menu..."
              className="border-0 w-100"
              style={{ outline: "none" }}
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

          {/* Filter */}
          <div className="mb-4 d-flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`btn ${
                  filterCategory === category
                    ? "btn-success"
                    : "btn-outline-secondary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="row">
            {/* Table */}
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
                        <th>Giá</th>
                        <th>Trạng thái</th>
                        <th className="text-end">Thao tác</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredFoods.map((food) => (
                        <tr
                          key={food.id}
                          onClick={() => setSelectedFood(food)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={food.image}
                                alt={food.name}
                                width="50"
                                height="50"
                                className="rounded"
                              />
                              <span className="fw-semibold">{food.name}</span>
                            </div>
                          </td>

                          <td>{food.category}</td>

                          <td className="fw-semibold">
                            {formatPrice(food.price)}
                          </td>

                          <td>{getStatusBadge(food.status)}</td>

                          <td className="text-end">
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
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="card-footer d-flex justify-content-between">
                  <small className="text-muted">
                    Hiển thị {filteredFoods.length} trong số {foods.length} món
                    ăn
                  </small>

                  <div>
                    <button className="btn btn-sm btn-outline-secondary me-2">
                      Trước
                    </button>

                    <button className="btn btn-sm btn-outline-secondary">
                      Tiếp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Food Details */}
            <div className="col-xl-4">
              <div className="card shadow-sm">
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />

                <div className="card-body">
                  <h5 className="fw-bold">{selectedFood.name}</h5>

                  <p className="text-muted">
                    {selectedFood.category} - {formatPrice(selectedFood.price)}
                  </p>

                  <hr />

                  <h6 className="fw-bold mb-3">Thông tin</h6>

                  <div className="mb-3">
                    <strong>Danh mục:</strong> {selectedFood.category}
                  </div>

                  <div className="mb-3">
                    <strong>Giá:</strong> {formatPrice(selectedFood.price)}
                  </div>

                  <div className="mb-3">
                    <strong>Trạng thái:</strong>{" "}
                    {getStatusBadge(selectedFood.status)}
                  </div>

                  <hr />

                  <div className="d-flex gap-2">
                    <button
                      className={`btn w-100 ${
                        selectedFood.status === "available"
                          ? "btn-outline-warning"
                          : "btn-outline-success"
                      }`}
                      onClick={() => toggleStatus(selectedFood.id)}
                    >
                      {selectedFood.status === "available"
                        ? "Tạm dừng bán"
                        : "Mở bán"}
                    </button>

                    <button
                      className="btn btn-success w-100"
                      onClick={() => openEditModal(selectedFood)}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
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
                    >
                      <option>Món chính</option>
                      <option>Đồ uống</option>
                      <option>Khai vị</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Giá (VNĐ)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL hình ảnh</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="available">Còn hàng</option>
                      <option value="out">Hết hàng</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingFood ? "Cập nhật" : "Thêm"}
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
