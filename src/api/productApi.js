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

const normalizeProductsResponse = (responseBody) => {
    if (Array.isArray(responseBody)) {
        return { products: responseBody, pagination: null };
    }

    if (Array.isArray(responseBody?.data)) {
        return {
            products: responseBody.data,
            pagination: responseBody.pagination || null,
        };
    }

    if (Array.isArray(responseBody?.data?.results)) {
        return {
            products: responseBody.data.results,
            pagination: responseBody.data.pagination || null,
        };
    }

    if (Array.isArray(responseBody?.results)) {
        return {
            products: responseBody.results,
            pagination: responseBody.pagination || null,
        };
    }

    return { products: [], pagination: responseBody?.pagination || null };
};

const buildProductsUrl = (page, perPage) => {
    const params = new URLSearchParams();

    if (Number.isFinite(page) && page > 0) {
        params.set("page", String(page));
    }

    if (Number.isFinite(perPage) && perPage > 0) {
        params.set("per_page", String(perPage));
    }

    const query = params.toString();
    return `${getBaseUrl()}/api/v1/menu/products/${query ? `?${query}` : ""}`;
};

export const getProducts = async (page = 1, perPage) => {
    const url = buildProductsUrl(page, perPage);
    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Không thể tải danh sách món: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeProductsResponse(data);
};

export const getAllProducts = async () => {
    const firstPage = await getProducts(1);
    const firstPagination = firstPage.pagination || {};
    const totalPages = Math.max(1, Number(firstPagination.total_pages) || 1);
    const perPage = Number(firstPagination.per_page) || undefined;

    if (totalPages === 1) {
        return firstPage;
    }

    const remainingRequests = Array.from({ length: totalPages - 1 }, (_, index) => {
        const page = index + 2;
        return getProducts(page, perPage);
    });

    const remainingPages = await Promise.all(remainingRequests);
    const products = [firstPage, ...remainingPages].flatMap((pageData) => pageData.products);

    return {
        products,
        pagination: {
            ...firstPagination,
            total_pages: totalPages,
            total: Number(firstPagination.total) || products.length,
        },
    };
};

export const getProductsSummary = async () => {
    const { products, pagination } = await getAllProducts();

    return {
        totalProducts: Number(pagination?.total) || products.length,
        loadedProducts: products.length,
        totalPages: Number(pagination?.total_pages) || 1,
    };
};
