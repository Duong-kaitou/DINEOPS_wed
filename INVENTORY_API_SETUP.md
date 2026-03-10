# DineOps Inventory API Integration

## ✅ Kết nối Backend Hoàn Tất

### API Configuration

- **Base URL**: `http://localhost:8000/api/v1/inventory`
- **Authentication**: Bearer Token (từ `localStorage.access_token` hoặc `localStorage.token`)

### API Endpoints Được Cấu Hình

```
GET    /api/v1/inventory/ingredients/              - Lấy danh sách nguyên liệu (có phân trang)
GET    /api/v1/inventory/ingredients/{id}/         - Lấy chi tiết nguyên liệu
POST   /api/v1/inventory/ingredients/               - Thêm nguyên liệu mới
PATCH  /api/v1/inventory/ingredients/{id}/         - Cập nhật nguyên liệu
DELETE /api/v1/inventory/ingredients/{id}/         - Xóa nguyên liệu
GET    /api/v1/inventory/ingredients/low-stock/    - Lấy nguyên liệu sắp hết
POST   /api/v1/inventory/ingredients/{id}/adjust-stock/ - Điều chỉnh kho
```

### Các Tính Năng Đã Cài Đặt

#### 1. **Lấy Dữ Liệu (CRUD)**

- ✅ Tải danh sách nguyên liệu từ backend
- ✅ Hỗ trợ phân trang (10 items/trang)
- ✅ Tự động fallback sang sample data nếu backend không khả dụng

#### 2. **Tìm Kiếm**

- ✅ Tìm kiếm theo tên nguyên liệu (realtime)
- ✅ Tìm kiếm được xử lý từ backend
- ✅ Pagination được reset khi tìm kiếm

#### 3. **Thêm (CREATE)**

- ✅ Modal form để thêm nguyên liệu mới
- ✅ Validate: Tên, Danh mục, Tồn kho, Đơn vị không được bỏ trống
- ✅ POST request đến backend
- ✅ Tự động cập nhật danh sách

#### 4. **Sửa (UPDATE)**

- ✅ Nút "Sửa" trên mỗi hàng
- ✅ Modal pre-filled với dữ liệu cũ
- ✅ PATCH request đến backend
- ✅ Tự động cập nhật hàng

#### 5. **Xóa (DELETE)**

- ✅ Nút "Xóa" trên mỗi hàng
- ✅ Xác nhận trước khi xóa
- ✅ DELETE request đến backend
- ✅ Tự động cập nhật danh sách

#### 6. **Trạng Thái**

- ✅ Badge hiển thị trạng thái: Còn hàng / Sắp hết / Hết hàng
- ✅ Dựa vào số lượng tồn kho

### Cấu Trúc Dữ Liệu

#### Request Create/Update

```json
{
  "name": "Thịt bò Wagyu",
  "category": "Thịt",
  "stock": 45,
  "unit": "kg"
}
```

#### Response từ API

```json
{
  "results": [
    {
      "id": 1,
      "name": "Thịt bò Wagyu",
      "category": "Thịt",
      "stock": 45,
      "unit": "kg"
    }
  ],
  "count": 24,
  "next": "http://...",
  "previous": null
}
```

### Files Đã Tạo/Cập Nhật

1. **`src/api/ingredientApi.js`** - API service functions

   - `getIngredients(page, pageSize, search)` - Lấy danh sách
   - `getIngredientById(id)` - Lấy chi tiết
   - `createIngredient(data)` - Thêm mới
   - `updateIngredient(id, data)` - Cập nhật
   - `deleteIngredient(id)` - Xóa
   - `getLowStockIngredients()` - Lấy nguyên liệu sắp hết
   - `adjustIngredientStock(id, adjustment, reason)` - Điều chỉnh kho
   - `searchIngredients(term, page, pageSize)` - Tìm kiếm

2. **`src/page/ingredient/InventoryPage.jsx`** - Components chính
   - State management cho fetch, pagination, form
   - handleAddClick() - Mở modal thêm
   - handleEditClick() - Mở modal sửa
   - handleSave() - Lưu (thêm/sửa)
   - handleDelete() - Xóa với xác nhận
   - Pagination controls
   - Modal form validation

### Lỗi & Xử Lý

#### Authentication

- Yêu cầu `access_token` hoặc `token` trong localStorage
- Nếu không có token: Hiển thị "No authentication token found"
- Fallback sang sample data nếu lỗi auth

#### Response Error

- Hiển thị error message từ backend (detail field)
- Fallback sang sample data nếu backend không khả dụng
- Alert cho user nếu có lỗi

### Cách Sử Dụng

#### 1. Đảm bảo Backend Chạy

```bash
# Terminal backend (Django/Python)
python manage.py runserver 8000
```

#### 2. Login để Có Token

Token sẽ được lưu vào localStorage sau khi login thành công

#### 3. Mở InventoryPage

InventoryPage sẽ tự động tải dữ liệu từ backend

#### 4. Các Tác Vụ

- **Search**: Gõ trong ô "Tìm nhanh..."
- **Add**: Click "Thêm nguyên liệu mới"
- **Edit**: Click "Sửa" trên hàng
- **Delete**: Click "Xóa" trên hàng (phải xác nhận)
- **Pagination**: Click số trang hoặc Trước/Sau

### Postman Collection Reference

API configuration dựa trên DineOps API Collection v2.0.0:

- Base URL: `http://localhost:8000`
- Section: "6. Inventory API" → "Ingredients"

### Next Steps (Tuỳ Chọn)

- [ ] Thêm filter theo category từ backend
- [ ] Thêm export CSV/Excel
- [ ] Thêm import từ Excel
- [ ] Thêm alert khi low stock
- [ ] Thêm history adjustment tracking
