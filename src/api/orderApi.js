const getAuthToken = () => {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
};

const getBaseUrl = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    return `${baseUrl.replace(/\/$/, "")}/api/v1/orders`;
};

const getHeaders = (includeAuth = false) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    return headers;
};

const toNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const parseAmount = (value) => {
    const amount = Number.parseFloat(value);
    return Number.isFinite(amount) ? amount : 0;
};

const normalizeList = (body) => {
    if (Array.isArray(body)) {
        return { data: body, pagination: null };
    }

    if (Array.isArray(body?.data)) {
        return { data: body.data, pagination: body.pagination || null };
    }

    if (Array.isArray(body?.results)) {
        return { data: body.results, pagination: body.pagination || null };
    }

    if (Array.isArray(body?.data?.results)) {
        return { data: body.data.results, pagination: body.data.pagination || null };
    }

    return { data: [], pagination: body?.pagination || null };
};

const normalizeDetail = (body) => {
    if (body?.data && !Array.isArray(body.data)) {
        return body.data;
    }
    return body;
};

const buildQuery = (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            return;
        }
        query.set(key, String(value));
    });
    return query.toString();
};

const getErrorMessage = async (response, fallback) => {
    const data = await response.json().catch(() => null);
    return data?.message || data?.msg || data?.detail || fallback;
};

const request = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            `Yeu cau that bai: ${response.statusText}`
        );
        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json().catch(() => null);
};

export const getOrders = async (params = {}) => {
    const query = buildQuery(params);
    const url = `${getBaseUrl()}/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeList(data);
};

export const getOrderById = async (id) => {
    const url = `${getBaseUrl()}/${id}/`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeDetail(data);
};

export const createOrder = async (payload) => {
    const url = `${getBaseUrl()}/`;
    const data = await request(url, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify(payload),
    });
    return normalizeDetail(data);
};

export const getActiveOrders = async () => {
    const url = `${getBaseUrl()}/active/`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeList(data);
};

export const getOrdersByTable = async (tableId) => {
    const query = buildQuery({ table_id: tableId });
    const url = `${getBaseUrl()}/by-table/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeList(data);
};

export const getOrderByPayCode = async (payCode) => {
    const query = buildQuery({ pay_code: payCode });
    const url = `${getBaseUrl()}/by-paycode/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeDetail(data);
};

export const updateOrderStatus = async (id, status) => {
    const url = `${getBaseUrl()}/${id}/update-status/`;
    const data = await request(url, {
        method: "PATCH",
        headers: getHeaders(false),
        body: JSON.stringify({ status }),
    });
    return normalizeDetail(data);
};

export const deleteOrder = async (id) => {
    const url = `${getBaseUrl()}/${id}/`;
    await request(url, {
        method: "DELETE",
        headers: getHeaders(false),
    });
    return true;
};

export const getOrderItems = async (params = {}) => {
    const query = buildQuery(params);
    const url = `${getBaseUrl()}/items/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(true),
    });
    return normalizeList(data);
};

export const getOrderItemsByOrder = async (orderId) => {
    const query = buildQuery({ order_id: orderId });
    const url = `${getBaseUrl()}/items/by-order/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(true),
    });
    return normalizeList(data);
};

export const createOrderItem = async (payload) => {
    const url = `${getBaseUrl()}/items/`;
    const data = await request(url, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetail(data);
};

export const updateOrderItem = async (id, payload, method = "PATCH") => {
    const url = `${getBaseUrl()}/items/${id}/`;
    const data = await request(url, {
        method: method === "PUT" ? "PUT" : "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetail(data);
};

export const deleteOrderItem = async (id) => {
    const url = `${getBaseUrl()}/items/${id}/`;
    await request(url, {
        method: "DELETE",
        headers: getHeaders(true),
    });
    return true;
};

export const getOrderItemToppings = async (params = {}) => {
    const query = buildQuery(params);
    const url = `${getBaseUrl()}/toppings/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(true),
    });
    return normalizeList(data);
};

export const getOrderItemToppingsByItem = async (orderItemId) => {
    const query = buildQuery({ order_item_id: orderItemId });
    const url = `${getBaseUrl()}/toppings/by-item/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(true),
    });
    return normalizeList(data);
};

export const createOrderItemTopping = async (payload) => {
    const url = `${getBaseUrl()}/toppings/`;
    const data = await request(url, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetail(data);
};

export const updateOrderItemTopping = async (id, payload) => {
    const url = `${getBaseUrl()}/toppings/${id}/`;
    const data = await request(url, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetail(data);
};

export const deleteOrderItemTopping = async (id) => {
    const url = `${getBaseUrl()}/toppings/${id}/`;
    await request(url, {
        method: "DELETE",
        headers: getHeaders(true),
    });
    return true;
};

export const getAllOrders = async () => {
    const first = await getOrders({ page: 1 });
    const firstPagination = first.pagination || {};
    const totalPages = Math.max(
        1,
        toNumber(firstPagination.total_pages) || toNumber(firstPagination.pages) || 1
    );
    const pageSize = toNumber(firstPagination.per_page) || toNumber(firstPagination.page_size) || undefined;

    if (totalPages === 1) {
        return { orders: first.data, pagination: firstPagination };
    }

    const requests = Array.from({ length: totalPages - 1 }, (_, index) => {
        const page = index + 2;
        const params = { page };
        if (pageSize) {
            params.page_size = pageSize;
        }
        return getOrders(params);
    });

    const rest = await Promise.all(requests);
    const orders = [first, ...rest].flatMap((result) => result.data || []);

    return {
        orders,
        pagination: {
            ...firstPagination,
            total_pages: totalPages,
            total: toNumber(firstPagination.total) || toNumber(firstPagination.count) || orders.length,
        },
    };
};

const getTodayDateKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getHourFromDateTime = (dateTimeString) => {
    if (typeof dateTimeString !== "string") {
        return -1;
    }

    const timePart = dateTimeString.split(" ")[1] || "";
    const hourPart = timePart.split(":")[0] || "";
    const hour = Number.parseInt(hourPart, 10);
    return Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : -1;
};

const getMonthKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};

const getDayFromDateTime = (dateTimeString) => {
    if (typeof dateTimeString !== "string") {
        return -1;
    }

    const datePart = dateTimeString.split(" ")[0] || "";
    const dayPart = datePart.split("-")[2] || "";
    const day = Number.parseInt(dayPart, 10);
    return Number.isInteger(day) && day >= 1 && day <= 31 ? day : -1;
};

export const getOrdersSummary = async () => {
    const { orders, pagination } = await getAllOrders();

    const totalRevenue = orders.reduce(
        (sum, order) => sum + parseAmount(order?.total_amount),
        0
    );

    const totalOrders =
        toNumber(pagination?.total) || toNumber(pagination?.count) || orders.length;

    return {
        totalRevenue,
        totalOrders,
        loadedOrders: orders.length,
        totalPages: toNumber(pagination?.total_pages) || 1,
    };
};

export const getOrdersAnalytics = async (period = "day") => {
    const { orders, pagination } = await getAllOrders();
    const totalRevenue = orders.reduce(
        (sum, order) => sum + parseAmount(order?.total_amount),
        0
    );
    const totalOrders =
        toNumber(pagination?.total) || toNumber(pagination?.count) || orders.length;

    let chartData = [];

    if (period === "month") {
        const now = new Date();
        const monthKey = getMonthKey(now);
        const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate();

        chartData = Array.from({ length: daysInMonth }, (_, index) => ({
            name: String(index + 1).padStart(2, "0"),
            value: 0,
        }));

        for (const order of orders) {
            const createdAt = String(order?.created_at || "");
            const orderMonthKey = (createdAt.split(" ")[0] || "").slice(0, 7);
            if (orderMonthKey !== monthKey) {
                continue;
            }

            const day = getDayFromDateTime(createdAt);
            if (day === -1 || day > daysInMonth) {
                continue;
            }

            chartData[day - 1].value += parseAmount(order?.total_amount);
        }
    } else {
        const todayKey = getTodayDateKey();
        chartData = Array.from({ length: 24 }, (_, hour) => ({
            name: `${String(hour).padStart(2, "0")}:00`,
            value: 0,
        }));

        for (const order of orders) {
            const createdAt = String(order?.created_at || "");
            const orderDateKey = createdAt.split(" ")[0] || "";
            if (orderDateKey !== todayKey) {
                continue;
            }

            const hour = getHourFromDateTime(createdAt);
            if (hour === -1) {
                continue;
            }

            chartData[hour].value += parseAmount(order?.total_amount);
        }
    }

    return {
        totalRevenue,
        totalOrders,
        loadedOrders: orders.length,
        totalPages: toNumber(pagination?.total_pages) || 1,
        chartData,
    };
};
