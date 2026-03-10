import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { Eye, Moon, Search, Sun, Trash2 } from "lucide-react";
import {
    deleteOrder,
    getActiveOrders,
    getOrderById,
    getOrderByPayCode,
    getOrders,
    updateOrderStatus,
} from "../../api/orderApi";

const STATUS_OPTIONS = [
    "pending",
    "confirmed",
    "preparing",
    "served",
    "awaiting_payment",
    "completed",
    "cancelled",
];

const STATUS_LABELS = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    preparing: "Đang chuẩn bị",
    served: "Đã phục vụ",
    awaiting_payment: "Chờ thanh toán",
    completed: "Hoàn tất",
    cancelled: "Đã hủy",
};

const getStatusLabel = (status) => STATUS_LABELS[status] || status;

const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const prettyMoney = (value) => {
    return Number(value || 0).toLocaleString("vi-VN");
};

const normalizeSearchKeyword = (keyword) => {
    const raw = String(keyword || "").trim();
    if (!raw) {
        return "";
    }

    // Ho tro nhap tu nhien: "ban T05", "bàn T05", "table T05" -> "T05"
    return raw.replace(/^(ban|bàn|table)\s*/i, "").trim();
};

function OrdersDashboardPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersFilter, setOrdersFilter] = useState({
        search: "",
        status: "",
        ordering: "-created_at",
    });
    const [searchInput, setSearchInput] = useState("");
    const [statusUpdateValue, setStatusUpdateValue] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalItems: 0,
        pageSize: 0,
    });

    const loadOrders = async () => {
        setOrdersLoading(true);
        setGlobalError("");
        try {
            const list = await getOrders({ ...ordersFilter, page: currentPage });
            setOrders(list.data || []);

            const rawPagination = list.pagination || {};
            const totalPages = Math.max(
                1,
                toNumber(rawPagination.total_pages) || toNumber(rawPagination.pages) || toNumber(rawPagination.last_page) || 1
            );
            const totalItems =
                toNumber(rawPagination.total) || toNumber(rawPagination.count) || (list.data || []).length;
            const pageSize =
                toNumber(rawPagination.per_page) || toNumber(rawPagination.page_size) || (list.data || []).length;

            setPagination({
                totalPages,
                totalItems,
                pageSize,
            });

            if (!selectedOrder && list.data?.length) {
                setSelectedOrder(list.data[0]);
                setStatusUpdateValue(list.data[0].status || "pending");
            }
        } catch (error) {
            setGlobalError(error.message || "Không thể tải danh sách đơn hàng");
        } finally {
            setOrdersLoading(false);
        }
    };

    const loadActiveOrders = async () => {
        try {
            const result = await getActiveOrders();
            setActiveOrders(result.data || []);
        } catch {
            setActiveOrders([]);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [ordersFilter.search, ordersFilter.status, ordersFilter.ordering, currentPage]);

    const handleSearchOrders = () => {
        setCurrentPage(1);
        setOrdersFilter((prev) => ({
            ...prev,
            search: normalizeSearchKeyword(searchInput),
        }));
    };

    const goToPage = (page) => {
        const safePage = Math.min(Math.max(1, page), pagination.totalPages);
        setCurrentPage(safePage);
    };

    useEffect(() => {
        loadActiveOrders();
    }, []);

    const handleSelectOrder = async (order) => {
        try {
            const detail = await getOrderById(order.id);
            setSelectedOrder(detail);
            setStatusUpdateValue(detail.status || "pending");
        } catch (error) {
            setGlobalError(error.message || "Không thể tải chi tiết đơn hàng");
        }
    };

    const handleViewOrderByPayCode = async (order) => {
        if (!order?.pay_code) {
            setGlobalError("Đơn hàng không có mã thanh toán");
            return;
        }

        try {
            const detail = await getOrderByPayCode(order.pay_code);
            setSelectedOrder(detail);
            setStatusUpdateValue(detail.status || "pending");
        } catch (error) {
            setGlobalError(error.message || "Không thể tải lịch sử đơn hàng theo mã thanh toán");
        }
    };

    const handleUpdateOrderStatus = async () => {
        if (!selectedOrder?.id) return;
        try {
            const updated = await updateOrderStatus(selectedOrder.id, statusUpdateValue);
            setSelectedOrder(updated);
            await loadOrders();
            await loadActiveOrders();
        } catch (error) {
            setGlobalError(error.message || "Không thể cập nhật trạng thái đơn hàng");
        }
    };

    const handleDeleteOrder = async () => {
        if (!selectedOrder?.id) return;
        if (!window.confirm("Bạn chắc chắn muốn xóa đơn hàng này?")) return;

        try {
            await deleteOrder(selectedOrder.id);
            setSelectedOrder(null);
            await loadOrders();
            await loadActiveOrders();
        } catch (error) {
            setGlobalError(error.message || "Không thể xóa đơn hàng");
        }
    };

    return (
        <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
            <Sidebar />

            <div className="main-content p-4">
                <nav className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Quản lý đơn hàng</h4>

                    <div className="d-flex align-items-center gap-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="btn btn-light rounded-circle p-2 shadow-sm"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="rounded-circle bg-secondary" style={{ width: 40, height: 40 }} />
                    </div>
                </nav>

                {globalError ? <div className="alert alert-danger py-2">{globalError}</div> : null}

                <div className="row g-4">
                    <div className="col-xl-8">
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <div className="row g-2 align-items-end">
                                    <div className="col-md-4">
                                        <label className="form-label">Tìm kiếm</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><Search size={16} /></span>
                                            <input
                                                className="form-control"
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleSearchOrders();
                                                    }
                                                }}
                                                placeholder="Số bàn, ghi chú..."
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select
                                            className="form-select"
                                            value={ordersFilter.status}
                                            onChange={(e) => {
                                                setCurrentPage(1);
                                                setOrdersFilter((prev) => ({ ...prev, status: e.target.value }));
                                            }}
                                        >
                                            <option value="">Tất cả</option>
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>{getStatusLabel(status)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Sắp xếp</label>
                                        <select
                                            className="form-select"
                                            value={ordersFilter.ordering}
                                            onChange={(e) => {
                                                setCurrentPage(1);
                                                setOrdersFilter((prev) => ({ ...prev, ordering: e.target.value }));
                                            }}
                                        >
                                            <option value="-created_at">Mới nhất</option>
                                            <option value="created_at">Cũ nhất</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <button className="btn btn-outline-secondary w-100" onClick={handleSearchOrders}>
                                            Tìm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm mb-4">
                            <div className="card-body p-0">
                                <div className="p-3 border-bottom d-flex justify-content-between">
                                    <h5 className="mb-0">Danh sách đơn hàng</h5>
                                    <span className="text-muted">Đang hoạt động: {activeOrders.length}</span>
                                </div>
                                {ordersLoading ? <div className="p-3 text-muted">Đang tải đơn hàng...</div> : null}
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Bàn</th>
                                            <th>Trạng thái</th>
                                            <th>Mã thanh toán</th>
                                            <th>Tổng tiền</th>
                                            <th className="text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                onClick={() => handleSelectOrder(order)}
                                                style={{ cursor: "pointer" }}
                                                className={selectedOrder?.id === order.id ? "table-active" : ""}
                                            >
                                                <td>{order.id}</td>
                                                <td>{order.table_number || order.table}</td>
                                                <td>{order.status_display || order.status}</td>
                                                <td>{order.pay_code}</td>
                                                <td>{prettyMoney(order.total_amount)}đ</td>
                                                <td className="text-center">

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Xóa đơn hàng"
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (
                                                                !window.confirm(
                                                                    `Bạn chắc chắn muốn xóa đơn #${order.id}?`
                                                                )
                                                            ) {
                                                                return;
                                                            }

                                                            try {
                                                                await deleteOrder(order.id);
                                                                if (selectedOrder?.id === order.id) {
                                                                    setSelectedOrder(null);
                                                                }
                                                                await loadOrders();
                                                                await loadActiveOrders();
                                                            } catch (error) {
                                                                setGlobalError(
                                                                    error.message || "Không thể xóa đơn hàng"
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {!ordersLoading && orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center text-muted py-4">
                                                    Không có đơn hàng trong trang này.
                                                </td>
                                            </tr>
                                        ) : null}
                                    </tbody>
                                </table>

                                <div className="p-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <span className="text-muted small">
                                        Trang {currentPage}/{pagination.totalPages} - Tổng {pagination.totalItems} đơn
                                    </span>

                                    <div className="btn-group" role="group" aria-label="Phân trang đơn hàng">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage <= 1 || ordersLoading}
                                        >
                                            Trước
                                        </button>

                                        {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
                                            .filter((page) =>
                                                page === 1 ||
                                                page === pagination.totalPages ||
                                                Math.abs(page - currentPage) <= 1
                                            )
                                            .map((page, index, arr) => {
                                                const prevPage = arr[index - 1];
                                                const showDots = prevPage && page - prevPage > 1;

                                                return (
                                                    <React.Fragment key={`page-${page}`}>
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
                                                            className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-secondary"}`}
                                                            onClick={() => goToPage(page)}
                                                            disabled={ordersLoading}
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
                                            disabled={currentPage >= pagination.totalPages || ordersLoading}
                                        >
                                            Sau
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4">
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h6>Chi tiết đơn hàng</h6>
                                {selectedOrder ? (
                                    <>
                                        <div>ID: {selectedOrder.id}</div>
                                        <div>Bàn: {selectedOrder.table_number || selectedOrder.table}</div>
                                        <div>Mã thanh toán: {selectedOrder.pay_code}</div>
                                        <div>Tổng tiền: {prettyMoney(selectedOrder.total_amount)}đ</div>
                                        <div>Số món: {selectedOrder.items_count || selectedOrder.items?.length || 0}</div>
                                        <div className="mt-2">
                                            <label className="form-label">Cập nhật trạng thái</label>
                                            <div className="d-flex gap-2">
                                                <select
                                                    className="form-select"
                                                    value={statusUpdateValue}
                                                    onChange={(e) => setStatusUpdateValue(e.target.value)}
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <option key={status} value={status}>{getStatusLabel(status)}</option>
                                                    ))}
                                                </select>
                                                <button className="btn btn-warning" onClick={handleUpdateOrderStatus}>
                                                    Cập nhật
                                                </button>
                                            </div>
                                        </div>

                                        <hr />
                                        <h6 className="mb-2">Danh sách món đã gọi</h6>
                                        {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                                            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                                                {selectedOrder.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="border rounded p-2 mb-2"
                                                    >
                                                        <div className="fw-semibold">
                                                            {item.product_name || item.variant_details?.product_name || `Món #${item.variant}`}
                                                        </div>
                                                        <div className="small text-muted">
                                                            Size: {item.size || item.variant_details?.size_display || item.variant_details?.size || "-"}
                                                        </div>
                                                        <div className="small">
                                                            SL: {item.quantity} x {prettyMoney(item.price)}đ
                                                        </div>
                                                        <div className="small fw-semibold text-success">
                                                            Thành tiền: {prettyMoney(item.total_price)}đ
                                                        </div>
                                                        {item.notes ? (
                                                            <div className="small text-muted">Ghi chú: {item.notes}</div>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-muted small">Chưa có món trong đơn hàng này.</div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-muted">Chọn đơn hàng để xem chi tiết</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrdersDashboardPage;
