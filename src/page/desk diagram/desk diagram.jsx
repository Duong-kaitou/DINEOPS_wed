import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Search, Sun, Moon } from "lucide-react";
import {
  createTable,
  deleteTable,
  getTablesWithPagination,
  updateTable,
  updateTableStatus,
} from "../../api/tableApi";

const TABLE_STATUSES = ["available", "occupied", "reserved"];

const mapApiTableToUi = (table) => ({
  id: table.id,
  name: table.table_number || `Bàn ${table.id}`,
  seats: Number(table.capacity) || 0,
  location: table.location || "-",
  status: TABLE_STATUSES.includes(table.status) ? table.status : "available",
});

function FloorManagement() {
  const [darkMode, setDarkMode] = useState(false);
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [tablesError, setTablesError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    seats: 2,
    location: "",
    status: "available",
  });

  const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const loadTables = async () => {
    setIsLoadingTables(true);
    setTablesError("");

    try {
      const result = await getTablesWithPagination({ search: searchTerm, page: currentPage });
      const apiTables = result.data || [];
      const mappedTables = apiTables.map(mapApiTableToUi);
      setTables(mappedTables);

      const rawPagination = result.pagination || {};
      const totalPages = Math.max(
        1,
        toNumber(rawPagination.total_pages) || toNumber(rawPagination.pages) || toNumber(rawPagination.last_page) || 1
      );
      const totalItems = toNumber(rawPagination.total) || toNumber(rawPagination.count) || mappedTables.length;
      setPagination({ totalPages, totalItems });
    } catch (error) {
      console.error("Lỗi khi tải danh sách bàn:", error);
      setTablesError(
        error?.message ||
        "Không thể tải danh sách bàn. Vui lòng kiểm tra đăng nhập hoặc API."
      );
    } finally {
      setIsLoadingTables(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, [searchTerm, currentPage]);

  const goToPage = (page) => {
    const safePage = Math.min(Math.max(1, page), pagination.totalPages);
    setCurrentPage(safePage);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      table_number: formData.name.trim(),
      capacity: Number(formData.seats) || 0,
      status: formData.status,
      location: formData.location.trim(),
    };

    if (!payload.table_number) {
      setTablesError("Tên bàn không được để trống.");
      return;
    }

    setIsSaving(true);
    setTablesError("");

    try {
      if (editingTable) {
        const statusChangedOnly =
          editingTable.status !== payload.status &&
          editingTable.name === payload.table_number &&
          Number(editingTable.seats) === payload.capacity &&
          String(editingTable.location || "") === payload.location;

        if (statusChangedOnly) {
          await updateTableStatus(editingTable.id, payload.status);
        } else {
          await updateTable(editingTable.id, payload, "PATCH");
        }
      } else {
        await createTable(payload);
      }

      await loadTables();
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi lưu bàn:", error);
      setTablesError(
        error?.message ||
        "Không thể lưu thông tin bàn. Vui lòng thử lại sau."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tableId) => {
    if (window.confirm("Bạn có chắc muốn xóa bàn này?")) {
      try {
        setTablesError("");
        await deleteTable(tableId);
        await loadTables();
      } catch (error) {
        console.error("Lỗi khi xóa bàn:", error);
        setTablesError(
          error?.message || "Không thể xóa bàn. Vui lòng thử lại sau."
        );
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
              placeholder="Tìm kiếm bàn..."
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
            <h2 className="fw-bold">Sơ đồ bàn và Tầng</h2>
            <p className="text-muted">Quản lý bàn ăn và tầng phục vụ</p>
          </header>

          <div className="dashboard-card bg-white p-4">
            <h5 className="fw-bold mb-3">Danh sách bàn</h5>

            {isLoadingTables ? (
              <div className="text-muted mb-3">Đang tải danh sách bàn...</div>
            ) : null}

            {!isLoadingTables && tablesError ? (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {tablesError}
              </div>
            ) : null}

            <div className="row g-3">
              {tables.map((table) => (
                <div className="col-md-3 col-lg-2" key={table.id}>
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-end mb-3">
                        {getStatusBadge(table.status)}
                      </div>

                      <h6>{table.name}</h6>

                      <small className="text-muted d-block">
                        {table.seats} chỗ
                      </small>

                      <small className="text-muted d-block mb-3">
                        {table.location}
                      </small>

                      <div className="d-flex gap-2 justify-content-end">
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

              {!isLoadingTables && tables.length === 0 ? (
                <div className="col-12">
                  <div className="text-center text-muted py-4 border rounded">
                    Không có bàn trong trang này.
                  </div>
                </div>
              ) : null}

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

            <div className="mt-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <small className="text-muted">
                Trang {currentPage}/{pagination.totalPages} - Tổng {pagination.totalItems} bàn
              </small>

              <div className="btn-group" role="group" aria-label="Phân trang bàn">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoadingTables}
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
                      <React.Fragment key={`table-page-${page}`}>
                        {showDots ? (
                          <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                            ...
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-secondary"}`}
                          onClick={() => goToPage(page)}
                          disabled={isLoadingTables}
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
                  disabled={currentPage >= pagination.totalPages || isLoadingTables}
                >
                  Sau
                </button>
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
                    disabled={isSaving}
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? "Đang lưu..." : editingTable ? "Lưu" : "Thêm"}
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
