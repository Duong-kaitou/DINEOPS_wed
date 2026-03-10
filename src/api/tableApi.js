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

export const getTables = async () => {
    const url = `${getBaseUrl()}/api/v1/tables/`;
    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Không thể tải danh sách bàn: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeTableResponse(data);
};
