# 🏗️ Frontend Next.js App Router — Checklist của Senior

## 1. Công cụ & Core Stack

| Hạng mục | Lựa chọn dự án | Ghi chú |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | Fullstack React framework (Server Components + Route Handlers) |
| Language | **TypeScript** (strict mode) | Bắt buộc với codebase lớn. Cấm sử dụng `any`. |
| UI/Components | **Ant Design + TailwindCSS v4** | Sử dụng kết hợp CSS utility và UI Component dựng sẵn |
| Data Grid | **AG Grid** | Bắt buộc dùng cho các bảng dữ liệu phức tạp / lượng lớn row |
| Package manager | **npm** | Quản lý thông qua scripts trong `package.json` |

---

## 2. Cấu trúc thư mục (Next.js App Router Convention)

Dự án theo chuẩn Next.js `/app` & `/lib`:

```text
/app
  ├── (auth)/          # Route group cho Authentication (ví dụ: login)
  ├── dashboard/       # Layout & pages cho hệ thống chính
  ├── api/             # Next.js Route Handlers (Backend API fullstack)
  ├── components/      # UI components dùng chung toàn dự án
  ├── layout.tsx       # Root layout (nơi wrap AntdRegistry, AuthProvider)
  └── page.tsx         # Home page (auto redirect sang /dashboard)
/lib
  ├── utils/           # helper functions, formatters (currency, period helpers)
  ├── hooks/           # custom React hooks
  ├── types.ts         # TypeScript types dùng chung
  └── stores/          # Zustand global state (nếu có, VD: auth store, ui state)
```

---

## 3. Styling & UI Layer

- Kết hợp **Tailwind CSS** (cho layout, spacing, typography) và **Ant Design** (cho input, select, date picker chuẩn Dashboard), ưu tiên sử dụng **Tailwind CSS** trong việc styling cho element.
- **Phải import `@ant-design/nextjs-registry`** trong root layout. Nếu thiếu, SSR trên màn load đầu tiên của AntD sẽ bị lỗi CSS.
- **Tiện ích Tailwind trong React:** Dùng `clsx` và `tailwind-merge` (file tiện ích `cn()`) để override Tailwind dynamic class cho component.

---

## 4. Code Quality & Kỷ luật

- Tuyệt đối **không dùng `any`**. Dùng `unknown` nếu chưa rõ kiểu hoặc định nghĩa interface chuẩn.
- BẤT KỲ logic tiền tệ nào cũng phải dùng `decimal.js`, Tuyệt đối Không dùng kiểu `Float` hay tính toán Javascript thuần do lỗi dấu phẩy động.
- Áp dụng cấu trúc giới hạn File Size: **Max 300 dòng**. Bất kỳ Component > 150 dòng nào chứa Form/Table phức tạp BẮT BUỘC phải chia nhỏ ra.

---

## 5. Routing (File-Based Routing)

**Tuyệt đối quên thư viện `react-router-dom` đi**, dự án chạy trên Next.js App Router:
- Dùng `page.tsx` render UI của một route.
- Dùng `layout.tsx` bao bọc components (như Sidebar, Header) để không bị re-render.
- Dùng ngoặc đơn `(folderName)` để tạo Grouping URL (chỉ nhóm thư mục, không tự thêm vào đường dẫn URL web).
- Chuyển trang dùng `<Link href="...">` của `next/link`.

---

## 6. Data Fetching & State Management

| Loại state | Giải pháp cho Next.js |
|---|---|
| Global UI state | **Zustand** (sidebar collapse, current theme, active comcode) |
| Form state | **React Hook Form** + Zod schema (validation form) |
| Server state & Fetch | **Next.js Server Components** (Fetch/query db thẳng Server side).<br/>Với Client, gọi API thẳng tới `/app/api/...` bằng `fetch()` hoặc Server Actions. |
| Local part state | `useState`, `useReducer` cho các logic con. |

> **Senior tip:** Đừng lôi API data để "cất" vào Zustand Global State. Zustand chỉ nên kiểm soát trạng thái tương tác UI. Việc gọi API, thao tác dữ liệu nên để cơ chế cache của Next.js hoặc fetch nội bộ xử lý.

---

## 7. Error Handling & Loading States

Tận dụng công năng File-based Boundaries của Next.js:
- **Loading UI:** Tạo file `loading.tsx` cùng cấp thư mục với `page.tsx`. Next.js tự động xử lý wrapper `<Suspense>` để render UI.
- **Error UI:** Dùng file `error.tsx` (Bắt buộc là Client component `"use client"`) để bắt lỗi phân vùng, không cho lỗi code đập nát toàn ứng dụng. Dùng `not-found.tsx` nếu check ID không tìm thấy trong Database.
- **Toast Notify:** Dùng `message` hoặc `notification` (của Ant Design).

---

## 8. Authentication & Bảo mật

- Dự án sử dụng hệ thống **NextAuth.js (`next-auth`)**.
- Cấu hình Global chặn người lạ: Tạo `middleware.ts` ở ngoài cùng thư mục root. Middleware sẽ check token session của NextAuth, redirect ngay những route bí mật (ví dụ: `/(dashboard)/*`) về trang Login.

---

## 9. Biến Môi trường (Environments)

Cách gọi cũng thay đổi hoàn toàn so với Vite:
- `.env` và `.env.local`: Cơ chế đọc local (tuyệt đối không commit .local).
- Prefix gọi Client Side: Nếu cần phơi bày biến (public key, domain) sang trình duyệt, phải đặt tên bắt đầu bằng `NEXT_PUBLIC_` (VD: `NEXT_PUBLIC_FIREBASE_API_KEY`). Không dùng `VITE_`.
- Prefix ở Server Side (Route Handlers, Server Component): Dùng bình thường `process.env.ABC`.

---

## 10. Checklist Nhanh (BTM Finance Daily Flow)

```text
[ ] Tách bạch rạch ròi: Node này là Server Component (mặc định) hay Client Component (cần thêm `"use client"`)?
[ ] Text hiển thị của Page/Component đã update vào file locale (i18n) chưa hay vẫn viết hardcode?
[ ] Input / Modal có dựa trên thư viện Ant Design chưa? Giao diện complex list đã import AG Grid chưa?
[ ] API/Dữ liệu có đang validate đầu vào (Schema Zod) tốt tại thư mục app/api/ route không?
[ ] Số tiền hiển thị đã format bằng thư viện utils currency tự build chưa?
```
