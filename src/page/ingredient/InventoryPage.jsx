import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon, Edit2, Trash2, Plus } from "lucide-react";

function InventoryPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [ingredients, setIngredients] = useState([
    {
      id: 1,
      name: "Cà phê hạt",
      unit: "kg",
      number_of: 50.5,
      min_quantity: 10,
    },
    {
      id: 2,
      name: "Đường",
      unit: "kg",
      number_of: 25.3,
      min_quantity: 5,
    },
    {
      id: 3,
      name: "Bột mì",
      unit: "kg",
      number_of: 3.2,
      min_quantity: 5,
    },
    {
      id: 4,
      name: "Sữa tươi",
      unit: "liter",
      number_of: 0,
      min_quantity: 10,
    },
    {
      id: 5,
      name: "Bơ",
      unit: "kg",
      number_of: 100.5,
      min_quantity: 20,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    unit: "kg",
    number_of: 0,
    min_quantity: 0,
  });

  // 🔍 Lọc nguyên liệu theo tìm kiếm
  const filteredIngredients = ingredients.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎨 Xác định trạng thái
  const getStatus = (number_of, min_quantity) => {
    if (number_of === 0) return "Hết hàng";
    if (number_of <= min_quantity) return "Cảnh báo";
    return "Còn hàng";
  };

  // 🎨 Badge trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "Còn hàng":
        return <span className="badge bg-success">Còn hàng</span>;
      case "Cảnh báo":
        return <span className="badge bg-warning text-dark">Cảnh báo</span>;
      case "Hết hàng":
        return <span className="badge bg-danger">Hết hàng</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  // ➕ Mở modal thêm mới
  const openAddModal = () => {
    setEditingIngredient(null);
    setFormData({
      name: "",
      unit: "kg",
      number_of: 0,
      min_quantity: 0,
    });
    setShowModal(true);
  };

  // ✏️ Mở modal sửa
  const openEditModal = (ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({ ...ingredient });
    setShowModal(true);
  };

  // 📝 Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // 💾 Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên nguyên liệu");
      return;
    }

    if (editingIngredient) {
      // ✏️ Sửa nguyên liệu
      setIngredients(
        ingredients.map((item) =>
          item.id === editingIngredient.id ? { ...item, ...formData } : item
        )
      );
    } else {
      // ➕ Thêm nguyên liệu mới
      const newIngredient = {
        id: Math.max(...ingredients.map((i) => i.id), 0) + 1,
        ...formData,
      };
      setIngredients([...ingredients, newIngredient]);
    }

    setShowModal(false);
  };

  // 🗑️ Xóa nguyên liệu
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nguyên liệu này?")) {
      setIngredients(ingredients.filter((item) => item.id !== id));
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar />

      <div className="main-content p-4">
        {/* 🔝 Navbar */}
        <nav className="d-flex justify-content-between align-items-center mb-4">
          <div
            className="search-bar bg-white px-3 py-2 rounded-pill shadow-sm d-flex align-items-center"
            style={{ width: "400px" }}
          >
            <Search size={18} className="text-secondary me-2" />
            <input
              type="text"
              placeholder="Tìm kiếm nguyên liệu..."
              className="border-0 w-100"
              style={{ outline: "none" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          {/* 📄 Header */}
          <header className="mb-4">
            <h2 className="fw-bold">Quản lý Nguyên liệu</h2>
            <p className="text-muted">Quản lý kho và theo dõi hàng tồn kho</p>
          </header>

          {/* 📋 Table */}
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="fw-bold mb-0">Danh sách nguyên liệu</h5>
                <button
                  className="btn btn-success btn-sm"
                  onClick={openAddModal}
                >
                  <Plus size={16} className="me-2" />
                  Thêm nguyên liệu
                </button>
              </div>

              {filteredIngredients.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <p>Không tìm thấy nguyên liệu nào</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Tên nguyên liệu</th>
                        <th>Đơn vị</th>
                        <th>Số lượng</th>
                        <th>Mức tối thiểu</th>
                        <th className="text-center">Trạng thái</th>
                        <th className="text-end">Thao tác</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredIngredients.map((item) => (
                        <tr
                          key={item.id}
                          className={
                            item.number_of === 0
                              ? "table-danger opacity-50"
                              : ""
                          }
                        >
                          <td className="fw-semibold">{item.name}</td>

                          <td>
                            <span className="badge bg-secondary">
                              {item.unit}
                            </span>
                          </td>

                          <td className="fw-semibold">{item.number_of}</td>

                          <td>
                            <span className="badge bg-light text-dark">
                              {item.min_quantity} {item.unit}
                            </span>
                          </td>

                          <td className="text-center">
                            {getStatusBadge(
                              getStatus(item.number_of, item.min_quantity)
                            )}
                          </td>

                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => openEditModal(item)}
                              title="Sửa"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(item.id)}
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="card-footer d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Hiển thị {filteredIngredients.length} trong số{" "}
                {ingredients.length} nguyên liệu
              </small>

              <div>
                <button className="btn btn-sm btn-outline-secondary me-2">
                  ← Trước
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  Tiếp →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 🔧 Modal Form */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">
                  {editingIngredient
                    ? " Sửa nguyên liệu"
                    : " Thêm nguyên liệu mới"}
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
                    <label className="form-label fw-semibold">
                      Tên nguyên liệu <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="VD: Cà phê hạt, Đường..."
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Đơn vị <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        required
                      >
                        <option>kg</option>
                        <option>g</option>
                        <option>liter</option>
                        <option>ml</option>
                        <option>bó</option>
                        <option>cái</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Số lượng <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="number_of"
                        value={formData.number_of}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Mức tối thiểu <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="min_quantity"
                      value={formData.min_quantity}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      required
                    />
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
                    {editingIngredient ? " Cập nhật" : " Thêm"}
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

export default InventoryPage;
