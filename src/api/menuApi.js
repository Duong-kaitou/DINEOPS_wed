const getAuthToken = () => {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
};

const getBaseUrl = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
    return `${baseUrl.replace(/\/$/, "")}/api/v1/menu`;
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

const getErrorMessage = async (response, fallback) => {
    const data = await response.json().catch(() => null);
    return data?.message || data?.msg || data?.detail || fallback;
};

const normalizeListResponse = (body) => {
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

const normalizeDetailResponse = (body) => {
    if (body?.data && !Array.isArray(body.data)) {
        return body.data;
    }
    return body;
};

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

export const getCategories = async (params = {}) => {
    const query = buildQuery(params);
    const url = `${getBaseUrl()}/categories/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeListResponse(data);
};

export const getCategoryById = async (id) => {
    const url = `${getBaseUrl()}/categories/${id}/`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeDetailResponse(data);
};

export const createCategory = async (payload) => {
    const url = `${getBaseUrl()}/categories/`;
    const data = await request(url, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetailResponse(data);
};

export const updateCategory = async (id, payload, method = "PATCH") => {
    const url = `${getBaseUrl()}/categories/${id}/`;
    const data = await request(url, {
        method: method === "PUT" ? "PUT" : "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetailResponse(data);
};

export const deleteCategory = async (id) => {
    const url = `${getBaseUrl()}/categories/${id}/`;
    await request(url, {
        method: "DELETE",
        headers: getHeaders(true),
    });
    return true;
};

export const getProducts = async (params = {}) => {
    const query = buildQuery(params);
    const url = `${getBaseUrl()}/products/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeListResponse(data);
};

export const getProductById = async (id) => {
    const url = `${getBaseUrl()}/products/${id}/`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeDetailResponse(data);
};

export const getProductsByCategory = async (categoryId) => {
    const query = buildQuery({ category_id: categoryId });
    const url = `${getBaseUrl()}/products/by-category/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeListResponse(data);
};

export const createProduct = async (payload) => {
    const url = `${getBaseUrl()}/products/`;
    const data = await request(url, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetailResponse(data);
};

export const updateProduct = async (id, payload, method = "PATCH") => {
    const url = `${getBaseUrl()}/products/${id}/`;
    const data = await request(url, {
        method: method === "PUT" ? "PUT" : "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetailResponse(data);
};

export const deleteProduct = async (id) => {
    const url = `${getBaseUrl()}/products/${id}/`;
    await request(url, {
        method: "DELETE",
        headers: getHeaders(true),
    });
    return true;
};

export const getVariants = async (params = {}) => {
    const query = buildQuery(params);
    const url = `${getBaseUrl()}/variants/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeListResponse(data);
};

export const getVariantById = async (id) => {
    const url = `${getBaseUrl()}/variants/${id}/`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeDetailResponse(data);
};

export const getVariantsByProduct = async (productId) => {
    const query = buildQuery({ product_id: productId });
    const url = `${getBaseUrl()}/variants/by-product/${query ? `?${query}` : ""}`;
    const data = await request(url, {
        method: "GET",
        headers: getHeaders(false),
    });
    return normalizeListResponse(data);
};

export const createVariant = async (payload) => {
    const url = `${getBaseUrl()}/variants/`;
    const data = await request(url, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetailResponse(data);
};

export const updateVariant = async (id, payload, method = "PATCH") => {
    const url = `${getBaseUrl()}/variants/${id}/`;
    const data = await request(url, {
        method: method === "PUT" ? "PUT" : "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
    });
    return normalizeDetailResponse(data);
};

export const deleteVariant = async (id) => {
    const url = `${getBaseUrl()}/variants/${id}/`;
    await request(url, {
        method: "DELETE",
        headers: getHeaders(true),
    });
    return true;
};
