const getAuthToken = () => {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
};

const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };

    const token = getAuthToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};

const getBaseUrl = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    return baseUrl.replace(/\/$/, "");
};

const normalizeOrdersResponse = (responseBody) => {
    if (Array.isArray(responseBody)) {
        return { orders: responseBody, pagination: null };
    }

    if (Array.isArray(responseBody?.data)) {
        return {
            orders: responseBody.data,
            pagination: responseBody.pagination || null,
        };
    }

    if (Array.isArray(responseBody?.data?.results)) {
        return {
            orders: responseBody.data.results,
            pagination: responseBody.data.pagination || null,
        };
    }

    if (Array.isArray(responseBody?.results)) {
        return {
            orders: responseBody.results,
            pagination: responseBody.pagination || null,
        };
    }

    return { orders: [], pagination: responseBody?.pagination || null };
};

const parseAmount = (value) => {
    const amount = Number.parseFloat(value);
    return Number.isFinite(amount) ? amount : 0;
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

const buildOrdersUrl = (page, perPage) => {
    const params = new URLSearchParams();

    if (Number.isFinite(page) && page > 0) {
        params.set("page", String(page));
    }

    if (Number.isFinite(perPage) && perPage > 0) {
        params.set("per_page", String(perPage));
    }

    const query = params.toString();
    return `${getBaseUrl()}/api/v1/orders/${query ? `?${query}` : ""}`;
};

export const getOrders = async (page = 1, perPage) => {
    const url = buildOrdersUrl(page, perPage);
    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Không thể tải danh sách đơn hàng: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeOrdersResponse(data);
};

export const getAllOrders = async () => {
    const firstPage = await getOrders(1);
    const firstPagination = firstPage.pagination || {};
    const totalPages = Math.max(1, Number(firstPagination.total_pages) || 1);
    const perPage = Number(firstPagination.per_page) || undefined;

    if (totalPages === 1) {
        return firstPage;
    }

    const remainingRequests = Array.from({ length: totalPages - 1 }, (_, index) => {
        const page = index + 2;
        return getOrders(page, perPage);
    });

    const remainingPages = await Promise.all(remainingRequests);
    const orders = [firstPage, ...remainingPages].flatMap((pageData) => pageData.orders);

    return {
        orders,
        pagination: {
            ...firstPagination,
            total_pages: totalPages,
            total: Number(firstPagination.total) || orders.length,
        },
    };
};

export const getOrdersSummary = async () => {
    const { orders, pagination } = await getAllOrders();

    const totalRevenue = orders.reduce(
        (sum, order) => sum + parseAmount(order?.total_amount),
        0
    );

    const totalOrders = Number(pagination?.total) || orders.length;

    return {
        totalRevenue,
        totalOrders,
        loadedOrders: orders.length,
        totalPages: Number(pagination?.total_pages) || 1,
    };
};

export const getOrdersAnalytics = async (period = "day") => {
    const { orders, pagination } = await getAllOrders();
    const totalRevenue = orders.reduce(
        (sum, order) => sum + parseAmount(order?.total_amount),
        0
    );
    const totalOrders = Number(pagination?.total) || orders.length;

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
        totalPages: Number(pagination?.total_pages) || 1,
        chartData,
    };
};
