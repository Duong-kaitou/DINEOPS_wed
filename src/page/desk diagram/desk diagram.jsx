import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon } from "lucide-react";

function FloorManagement() {
  const [darkMode, setDarkMode] = useState(false);
  const [tables, setTables] = useState([
    {
      id: 1,
      name: "Bàn 01",
      seats: 4,
      location: "Gần cửa sổ",
      status: "available",
    },
    {
      id: 2,
      name: "Bàn 02",
      seats: 2,
      location: "Trung tâm",
      status: "occupied",
    },
    {
      id: 3,
      name: "Phòng VIP 01",
      seats: 8,
      location: "VIP",
      status: "reserved",
    },
    {
      id: 4,
      name: "Bàn 04",
      seats: 4,
      location: "Ban công",
      status: "available",
    },
    {
      id: 5,
      name: "Bàn 05",
      seats: 4,
      location: "Cửa sổ trái",
      status: "occupied",
    },
    {
      id: 6,
      name: "Bàn 06",
      seats: 6,
      location: "Trung tâm",
      status: "available",
    },
    {
      id: 7,
      name: "Bàn 07",
      seats: 4,
      location: "Quầy Bar",
      status: "available",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    seats: 2,
    location: "",
    status: "available",
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return <span className="badge bg-success">Trống</span>;
      case "occupied":
        return <span className="badge bg-danger">Có khách</span>;
      case "reserved":
        return <span className="badge bg-warning text-dark">Đặt trước</span>;
      default:
        return null;
    }
  };

  const openAddModal = () => {
    setEditingTable(null);
    setFormData({ name: "", seats: 2, location: "", status: "available" });
    setShowModal(true);
  };

  const openEditModal = (table) => {
    setEditingTable(table);
    setFormData({
      name: table.name,
      seats: table.seats,
      location: table.location,
      status: table.status,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "seats" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTable) {
      setTables(
        tables.map((table) =>
          table.id === editingTable.id ? { ...table, ...formData } : table
        )
      );
    } else {
      const newTable = {
        id: Math.max(...tables.map((t) => t.id), 0) + 1,
        ...formData,
      };
      setTables([...tables, newTable]);
    }

    setShowModal(false);
  };

  const handleDelete = (tableId) => {
    if (window.confirm("Bạn có chắc muốn xóa bàn này?")) {
      setTables(tables.filter((table) => table.id !== tableId));
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
              placeholder="Tìm kiếm bàn..."
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
            <h2 className="fw-bold">Sơ đồ bàn và Tầng</h2>
            <p className="text-muted">Quản lý bàn ăn và tầng phục vụ</p>
          </header>

          <div className="dashboard-card bg-white p-4">
            <h5 className="fw-bold mb-3">Danh sách bàn</h5>
            <div className="row g-3">
              {tables.map((table) => (
                <div className="col-md-3 col-lg-2" key={table.id}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <strong>{table.id}</strong>
                        {getStatusBadge(table.status)}
                      </div>

                      <h6>{table.name}</h6>

                      <small className="text-muted d-block">
                        {table.seats} chỗ
                      </small>

                      <small className="text-muted d-block mb-3">
                        {table.location}
                      </small>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => openEditModal(table)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(table.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="col-md-3 col-lg-2">
                <div className="card h-100 text-center d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-outline-success"
                    onClick={openAddModal}
                  >
                    + Thêm bàn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingTable ? "Sửa bàn" : "Thêm bàn"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên bàn</label>
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
                    <label className="form-label">Số chỗ</label>
                    <input
                      type="number"
                      className="form-control"
                      name="seats"
                      value={formData.seats}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Vị trí</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="available">Trống</option>
                      <option value="occupied">Có khách</option>
                      <option value="reserved">Đặt trước</option>
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
                  <button type="submit" className="btn btn-primary">
                    {editingTable ? "Lưu" : "Thêm"}
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

export default FloorManagement;
