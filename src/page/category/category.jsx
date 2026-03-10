import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon } from "lucide-react";

function CategoryManagement() {
  const [darkMode, setDarkMode] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Món khai vị",
      description: "Các món nhẹ bắt đầu bữa tiệc",
      items: 12,
      active: true,
    },
    {
      id: 2,
      name: "Món chính",
      description: "Danh sách các món chính đặc sắc",
      items: 25,
      active: true,
    },
    {
      id: 3,
      name: "Tráng miệng",
      description: "Bánh ngọt, trái cây và kem",
      items: 8,
      active: true,
    },
    {
      id: 4,
      name: "Đồ uống",
      description: "Nước giải khát và rượu vang",
      items: 15,
      active: true,
    },
    {
      id: 5,
      name: "Món mùa lễ hội",
      description: "Các món đặc biệt dịp tết",
      items: 0,
      active: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
  });

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
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
      active: category.active,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCategory) {
      // Sửa danh mục
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat
        )
      );
    } else {
      // Thêm danh mục mới
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        ...formData,
        items: 0,
      };
      setCategories([...categories, newCategory]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
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
                  <h4 className="fw-bold">{categories.length}</h4>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Danh mục hoạt động</h6>
                  <h4 className="fw-bold text-success">
                    {categories.filter((c) => c.active).length}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Tổng số món</h6>
                  <h4 className="fw-bold">
                    {categories.reduce((sum, cat) => sum + cat.items, 0)}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Danh mục tạm dừng</h6>
                  <h4 className="fw-bold text-warning">
                    {categories.filter((c) => !c.active).length}
                  </h4>
                </div>
              </div>
            </div>
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
                    <th>Icon</th>
                    <th>Tên danh mục</th>
                    <th>Mô tả</th>
                    <th className="text-center">Số món</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className={!cat.active ? "text-muted" : ""}
                    >
                      <td>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: "#e8f5e9",
                            borderRadius: 8,
                          }}
                        />
                      </td>

                      <td className="fw-semibold">{cat.name}</td>

                      <td>{cat.description}</td>

                      <td className="text-center">
                        <span className="badge bg-secondary">{cat.items}</span>
                      </td>

                      <td className="text-center">
                        <div className="form-check form-switch d-inline-block">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={cat.active}
                            onChange={() => toggleStatus(cat.id)}
                          />
                        </div>
                      </td>

                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-success me-2">
                          Xem
                        </button>

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
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="card-footer d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Hiển thị {filteredCategories.length} trong số{" "}
                {categories.length} danh mục
              </small>

              <nav>
                <ul className="pagination mb-0">
                  <li className="page-item">
                    <button className="page-link">‹</button>
                  </li>

                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>

                  <li className="page-item">
                    <button className="page-link">2</button>
                  </li>

                  <li className="page-item">
                    <button className="page-link">3</button>
                  </li>

                  <li className="page-item">
                    <button className="page-link">›</button>
                  </li>
                </ul>
              </nav>
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
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingCategory ? "Cập nhật" : "Thêm"}
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
