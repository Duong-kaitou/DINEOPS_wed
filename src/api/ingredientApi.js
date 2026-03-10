
const API_BASE_URL = "http://localhost:8000/api/v1/inventory";

// Hàm hỗ trợ để lấy mã xác thực (token)
const getAuthToken = () => {
  return localStorage.getItem("access_token") || localStorage.getItem("token");
};

// Hàm hỗ trợ để tạo tiêu đề (headers) có chứa mã xác thực
const getHeaders = (includeAuth = true) => {
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

export const getIngredients = async (page = 1, pageSize = 10, search = "") => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const url = `${API_BASE_URL}/ingredients/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(
        `Không thể tải danh sách nguyên liệu: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Xử lý định dạng phản hồi API: {status, code, msg, data: {count, results}}
    if (data.data && data.data.results) {
      return {
        count: data.data.count,
        next: data.data.next,
        previous: data.data.previous,
        results: data.data.results,
      };
    }

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
    throw error;
  }
};

// 8.1.2 Lấy danh sách nguyên liệu sắp hết hàng (Nội bộ)
// GET /api/v1/inventory/ingredients/low-stock/
export const getLowStockIngredients = async () => {
  try {
    const url = `${API_BASE_URL}/ingredients/low-stock/`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(
        `Không thể lấy danh sách nguyên liệu tồn kho thấp: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Xử lý các định dạng phản hồi khác nhau
    if (data.data) {
      return Array.isArray(data.data) ? data.data : data.data.results || [];
    }

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nguyên liệu tồn kho thấp:", error);
    throw error;
  }
};

// Lấy danh sách nguyên liệu đã hết hàng (Nội bộ)
// GET /api/v1/inventory/ingredients/out-of-stock/
export const getOutOfStockIngredients = async () => {
  try {
    const url = `${API_BASE_URL}/ingredients/out-of-stock/`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(
        `Không thể lấy danh sách nguyên liệu đã hết hàng: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.data) {
      return Array.isArray(data.data) ? data.data : data.data.results || [];
    }

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nguyên liệu đã hết hàng:", error);
    throw error;
  }
};

// Tìm kiếm nguyên liệu (Nội bộ)
// GET /api/v1/inventory/ingredients/?q=coffee or /api/v1/inventory/ingredients/keyword/?q=coffee
export const searchIngredients = async (query, page = 1, pageSize = 10) => {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    // Tìm kiếm theo hai cách - thử endpoint /ingredients/ trước
    let url = `${API_BASE_URL}/ingredients/?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Lỗi tìm kiếm nguyên liệu: ${response.statusText}`);
    }

    const data = await response.json();

    // Xử lý định dạng phản hồi API
    if (data.data && data.data.results) {
      return {
        count: data.data.count,
        next: data.data.next,
        previous: data.data.previous,
        results: data.data.results,
      };
    }

    if (data.results) {
      return data;
    }

    return data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm nguyên liệu:", error);
    throw error;
  }
};

// 8.1.5 Điều chỉnh lượng tồn kho (Nội bộ)
// POST /api/v1/inventory/ingredients/{id}/adjust-stock/
// Dữ liệu gửi đi: {adjustment, reason} (số lượng điều chỉnh, lý do)
// Phản hồi: {status, code, msg, data: {id, name, unit, number_of, min_quantity}}
export const adjustIngredientStock = async (
  id,
  adjustment,
  reason = "Điều chỉnh kho hàng"
) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Không tìm thấy mã xác thực. Vui lòng đăng nhập.");
    }

    const url = `${API_BASE_URL}/ingredients/${id}/adjust-stock/`;

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ adjustment, reason }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
        errorData.message ||
        `Không thể điều chỉnh tồn kho: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Lỗi khi điều chỉnh tồn kho:", error);
    throw error;
  }
};

// Lấy thông tin một nguyên liệu qua ID (Nội bộ/Công khai - tùy backend)
// GET /api/v1/inventory/ingredients/{id}/
export const getIngredientById = async (id) => {
  try {
    const url = `${API_BASE_URL}/ingredients/${id}/`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(
        `Không thể lấy thông tin nguyên liệu: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nguyên liệu:", error);
    throw error;
  }
};

// Tạo nguyên liệu mới (Nội bộ)
// POST /api/v1/inventory/ingredients/
// Dữ liệu gửi đi: {name, unit, number_of, min_quantity}
// Phản hồi: {status, code, msg, data: {id, name, unit, number_of, min_quantity, ...}}
export const createIngredient = async (ingredientData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Không tìm thấy mã xác thực. Vui lòng đăng nhập.");
    }

    const url = `${API_BASE_URL}/ingredients/`;

    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(ingredientData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
        errorData.message ||
        `Không thể tạo nguyên liệu: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Lỗi khi tạo nguyên liệu:", error);
    throw error;
  }
};

// Cập nhật nguyên liệu (Nội bộ)
// PUT/PATCH /api/v1/inventory/ingredients/{id}/
// Dữ liệu gửi đi: {name?, unit?, number_of?, min_quantity?}
export const updateIngredient = async (id, ingredientData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Không tìm thấy mã xác thực. Vui lòng đăng nhập.");
    }

    const url = `${API_BASE_URL}/ingredients/${id}/`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(ingredientData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
        errorData.message ||
        `Không thể cập nhật nguyên liệu: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nguyên liệu:", error);
    throw error;
  }
};

// Xóa nguyên liệu (Nội bộ)
// DELETE /api/v1/inventory/ingredients/{id}/
export const deleteIngredient = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Không tìm thấy mã xác thực. Vui lòng đăng nhập.");
    }

    const deleteUrl = `${API_BASE_URL}/ingredients/${id}/`;

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: getHeaders(true),
    });

    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail ||
        errorData.message ||
        `Không thể xóa nguyên liệu: ${response.statusText}`
      );
    }

    return response.status === 204 ? { success: true } : await response.json();
  } catch (error) {
    console.error("Lỗi khi xóa nguyên liệu:", error);
    throw error;
  }
};
