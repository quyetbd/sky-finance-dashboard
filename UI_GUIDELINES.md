# 🎨 UI/UX Guidelines & Design System

> Tài liệu này chuẩn hóa giao diện cho toàn bộ dự án **BTM Finance**. Lấy màn hình `ProfitPage` làm chuẩn mực thiết kế. 
> Bất kỳ AI hoặc Developer nào kho tạo giao diện mới đều **PHẢI TUÂN THỦ NGHIÊM NGẶT** các class và cấu trúc dưới đây để tái sử dụng, tuyệt đối không tự ý dùng giá trị px hay màu sắc custom lộn xộn.

---

## 1. Hệ Thống Layout & Container (Spacing, Padding)

Mọi trang (Page) kết hợp List / Báo biểu / Form đều phải có cấu trúc xương sống như sau:

```tsx
// Khuôn mẫu bắt buộc cho trang (Page Root)
<div className='flex flex-col gap-4'>
  
  {/* 1. Vùng Header (Title & Button Action) */}
  <div className='flex justify-between items-center'>
     <h1>Title</h1>
     <Button>Action</Button>
  </div>

  {/* 2. Vùng Content / Table (Bọc trong thẻ Card Box trắng) */}
  <div className="flex-1 flex flex-col gap-3 overflow-y-hidden bg-white p-4 rounded-lg">
     {/* Bộ lọc (Filters) */}
     {/* Data Table */}
  </div>

</div>
```

- **Gap tiêu chuẩn:** Luôn dùng `gap-4` cho các mảng lớn, `gap-3` cho các mảng khít hơn bên trong khung Trắng. Không dùng margin tự do (`m-`).
- **Nền & Bo góc (Card):** Vùng nội dung chính (Table / Form) LUÔN bọc bằng `bg-white p-4 rounded-lg`. KHÔNG hardcode border thô.

---

## 2. Typography (Fonts & Text)

Nhờ sự đồng bộ với hệ thống theme của Ant Design, chữ nghĩa BẮT BUỘC dùng các thẻ Tailwind mapping với Design Token của AntD sau:

- **Page Title (`h1`):** `className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading"`
- Không tự ý dùng các thẻ `text-[#222]` hay `text-gray-900`. Mọi text tiêu đề phải ăn vào class `text-colorTextHeading` chung để sau này đổi Dark/Light theme không bị lỗi.

---

## 3. Filter Bar (Vùng Tìm Kiếm & Lọc) 

Thanh filter bên trên các báo cáo / bảng dữ liệu phải tuân thủ form sau (Dựa theo `TableReport.tsx`):

```tsx
<div className="flex-shrink-0 flex gap-4 items-center justify-between">
  
  {/* Nửa bên trái (Thường là Date Picker / Range Picker) */}
  <div>
    <DateRangeFilter />
  </div>

  {/* Nửa bên phải (Thường là các Dropdown, Cấu hình) */}
  <div className="flex justify-end gap-4">
    <ComcodeFilterDropdown />
    <SellerFilterDropdown />
    <StatusFilterDropdown />
  </div>

</div>
```
- Phải đảm bảo chiều cao thanh filter không bị thay đổi bằng `flex-shrink-0`.
- Các Dropdown Component nằm dọc nhau bằng `gap-4`.

---

## 4. Tables & Data Viewing

Thay vì tự gọi component `<Table>` thuần của thư mục `antd`, dự án đã có bộ Base cực kỳ xịn là `TableReport`.
- **Tuyệt đối tận dụng Component `app/dashboard/reports/components/TableReport.tsx`** khi cần show báo cáo. 
- Component này đã xử lý sẵn Scroll động kích thước (vd: `calc(100vh - 316px)`), pagination mặc định, fixed width wrapper chống vỡ table theo chiều ngang. 

---

## 5. Quy tắc chung cho AI khi viết UI

1. **NO CUSTOM STYLE:** Không bao giờ dùng Object styles như `style={{ marginTop: '20px', color: '#1890ff' }}`. Phải dùng Tailwind classes.
2. **NO HARDCODE:** Toàn bộ text phải dùng `{t('key')}` (next-intl).
3. **REUSABILITY FIRST:** Nếu cần một cái Dropdown, hãy nhìn sang `ComcodeFilterDropdown` để clone cấu trúc sử dụng `SelectDropdown`, không tự import `<Select>` rồi chắp vá lại từ đầu.
4. **RESPONSIVE & SCROLL Lock:** Layout Dashboard thường không được phép giãn cuộn mút chỉ trang web. Thẻ bao ngoài cùng thường bị ép `overflow-y-hidden`, còn cuộn lên xuống sẽ gán cho thẻ Table (`scroll={{ y: ... }}`). Đây là kĩ thuật Senior cho phần mềm SaaS.
