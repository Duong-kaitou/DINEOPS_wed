import { apiFetch } from '../../config';

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

const getBaseUrl = () => "";

const buildQuery = (params = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            return;
        }
        search.set(key, String(value));
    });
    return search.toString();
};

const normalizeTableResponse = (responseBody) => {
    if (Array.isArray(responseBody)) {
        return responseBody;
    }

    if (Array.isArray(responseBody?.data?.results)) {
        return responseBody.data.results;
    }

    if (Array.isArray(responseBody?.data)) {
        return responseBody.data;
    }

    if (Array.isArray(responseBody?.results)) {
        return responseBody.results;
    }

    return [];
};

const normalizeTableListResponse = (responseBody) => {
    if (Array.isArray(responseBody)) {
        return { data: responseBody, pagination: null };
    }

    if (Array.isArray(responseBody?.data?.results)) {
        return { data: responseBody.data.results, pagination: responseBody.data.pagination || null };
    }

    if (Array.isArray(responseBody?.data)) {
        return { data: responseBody.data, pagination: responseBody.pagination || null };
    }

    if (Array.isArray(responseBody?.results)) {
        return { data: responseBody.results, pagination: responseBody.pagination || null };
    }

    return { data: [], pagination: responseBody?.pagination || null };
};

const normalizeSingleTable = (responseBody) => {
    if (responseBody?.data && !Array.isArray(responseBody.data)) {
        return responseBody.data;
    }

    return responseBody;
};

const getErrorMessage = async (response, fallback) => {
    const errorData = await response.json().catch(() => null);
    return errorData?.msg || errorData?.detail || fallback;
};

export const getTablesWithPagination = async (params = {}) => {
    const query = buildQuery(params);
    const url = `${getBaseUrl()}/api/v1/tables/${query ? `?${query}` : ""}`;
    const response = await apiFetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Không thể tải danh sách bàn: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeTableListResponse(data);
};

export const getTables = async (params = {}) => {
    const result = await getTablesWithPagination(params);
    return normalizeTableResponse(result.data);
};

export const getTableById = async (id) => {
    const url = `${getBaseUrl()}/api/v1/tables/${id}/`;
    const response = await apiFetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Không thể tải chi tiết bàn: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeSingleTable(data);
};

export const createTable = async (payload) => {
    const url = `${getBaseUrl()}/api/v1/tables/`;
    const response = await apiFetch(url, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            `Không thể tạo bàn: ${response.statusText}`
        );
        throw new Error(message);
    }

    const data = await response.json().catch(() => null);
    return data ? normalizeSingleTable(data) : null;
};

export const updateTable = async (id, payload, method = "PATCH") => {
    const httpMethod = method === "PUT" ? "PUT" : "PATCH";
    const url = `${getBaseUrl()}/api/v1/tables/${id}/`;
    const response = await apiFetch(url, {
        method: httpMethod,
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            `Không thể cập nhật bàn: ${response.statusText}`
        );
        throw new Error(message);
    }

    const data = await response.json().catch(() => null);
    return data ? normalizeSingleTable(data) : null;
};

export const deleteTable = async (id) => {
    const url = `${getBaseUrl()}/api/v1/tables/${id}/`;
    const response = await apiFetch(url, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok && response.status !== 204) {
        const message = await getErrorMessage(
            response,
            `Không thể xóa bàn: ${response.statusText}`
        );
        throw new Error(message);
    }

    return true;
};

export const updateTableStatus = async (id, status) => {
    const url = `${getBaseUrl()}/api/v1/tables/${id}/update-status/`;
    const response = await apiFetch(url, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const message = await getErrorMessage(
            response,
            `Không thể cập nhật trạng thái bàn: ${response.statusText}`
        );
        throw new Error(message);
    }

    const data = await response.json().catch(() => null);
    return data ? normalizeSingleTable(data) : null;
};

export const getAvailableTables = async () => {
    const url = `${getBaseUrl()}/api/v1/tables/available/`;
    const response = await apiFetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Không thể tải bàn trống: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeTableResponse(data);
};

export const getTableOrders = async (id) => {
    const url = `${getBaseUrl()}/api/v1/tables/${id}/orders/`;
    const response = await apiFetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Không thể tải đơn của bàn: ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data?.data)) {
        return data.data;
    }
    if (Array.isArray(data?.results)) {
        return data.results;
    }
    return Array.isArray(data) ? data : [];
};
