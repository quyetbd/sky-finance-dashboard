# ⚙️ Backend Next.js (Prisma) — Checklist của Senior

> Chuẩn mực viết API & xử lý dữ liệu (Backend) trên Next.js 14 App Router, thiết kế riêng cho **BTM Finance** (Bởi quy mô Database kế toán lớn). Từng nguyên tắc được xây dựng để giữ code clean, an toàn ACID, và dễ dàng debug.

---

## 1. Cấu trúc API & Service Layer (Separation of Concerns)

- **Thin Route Handlers (Controller mỏng):** Các file `app/api/.../route.ts` BẮT BUỘC chỉ đóng vai trò phân luồng. Nhiệm vụ duy nhất của nó là:
  1. Kiểm tra Authentication & Ủy quyền.
  2. Parse và Validate Input (từ request param, search query, JSON body).
  3. Giao việc xuống hàm logic từ thư mục Service (vùng `lib/...`).
  4. Trả về kết quả JSON thống nhất định dạng.
  > 🚫 **TUYỆT ĐỐI KHÔNG** viết logic chằng chịt, hoặc for loop query DB ngàn dòng trực tiếp làm dơ file `route.ts`.
- **Thư mục Logic Lõi:** Mọi hệ thống tính toán (ETL Parser, GL Engine, Report Gen, Invoice Workflow) phải bỏ gọn trong `lib/gl-engine/`, `lib/etl/`, `lib/reports/`.
- **Max Length Limit:** File `route.ts` không được vượt quá 150 dòng.

---

## 2. Tiêu chuẩn CSDL & Prisma ORM

- **Connection Pooling:** Đảm bảo toàn dự án chỉ dùng một `PrismaClient` singleton lấy từ `lib/prisma.ts`. Ngăn chặn việc sập DB từ xa do Next.js hot reload đẻ ra hàng nghìn kết nối ảo trong lúc dev.
- **Tối ưu Query:** Ép buộc dùng mệnh đề `select` hoặc `include` để chỉ lấy đúng những trường cần thiết ở Backend. Ngăn ngừa việc rò rỉ (leak) dữ liệu mật ra Internet.
- **Quy tắc An Toàn Kép (Transactions):** Các thao tác Insert/Update liên đới nhiều bảng (Ví dụ: Tạo 1 `Order` + Tạo n `OrderItems` + Ghi sổ n dòng `GLEntry`) BẮT BUỘC chạy trong `prisma.$transaction()`. Lỗi 1 cái bắt buộc Rollback toàn cụm.
- **Batch Processing:** Nghiêm cấm dùng vòng lặp `for` n lần rồi chọc `prisma.model.create()` n lần. Phải thu thập thành 1 mảng và đẩy mạnh vào bằng `prisma.model.createMany()` (cực kì quan trọng đối với ETL Uploaders).

---

## 3. Data Integrity & Financial Domain Constraints

- **The Period Lock:** 
  - Mọi API có Method `POST/PUT/DELETE` (sinh dữ liệu) đều bắt buộc gọi filter check `assertPeriodOpen(comcode, period)`.
- **Data Isolation (Cô Lập Comcode):** 
  - Trong logic Where điều kiện DB, **BẮT BUỘC** lúc nào cũng phải kẹp cứng: `where: { comcode: userContext.comcode, ... }`. Việc bỏ sót điều kiện này sẽ dẫn đến thảm hoạ nhân sự Comcode này nhìn thấy số dư ngân hàng của Comcode khác.
- **Toán Học & Tiền Tệ:** 
  - Khai trừ toán tử cộng trừ Javascript `+`, `-`, `/`, `*` đối với giá trị kinh tế. 100% tính toán (AccountedDr, AccountedCr) dùng Object của `decimal.js` (`x.add(y)`, `x.mul(y)`...).

---

## 4. Xử lý Dữ liệu đầu vào (Validation)

- **Zero Trust (Không tin Data Frontend gửi lên):** 
  Tất cả data từ `req.json()` qua API, phải có **Zod Schema** chốt chặn xác thực type.
  ```ts
  const body = await req.json();
  const parsedData = invoiceSchema.safeParse(body);
  if (!parsedData.success) { return NextResponse.json({error: parsedData.error.message}, {status: 400}) }
  // ... sau đó mới truyền an toàn cho DB
  ```

---

## 5. Quy chuẩn Chuẩn Hoá API Response

- Mọi endpoint trả về Frontend tuân theo Interface chuẩn duy nhất `ApiResponse<T>` (sẽ được define ở `lib/types.ts`). Giúp Frontend setup Axios/Fetch Interceptor dễ dàng mà không cần IF ELSE kiểu dữ liệu.

```ts
// THÀNH CÔNG: return statusCode 200 | 201
return NextResponse.json({
  data: dataObjects,
  meta: { total: 100, page: 1 }
}, { status: 200 });

// LỖI NGHIỆP VỤ: return statusCode thích hợp (Thường 400 hoặc 403)
return NextResponse.json({
  error: "Fiscal Period YYYYMM của pháp nhân này đã đóng."
}, { status: 403 });
```

---

## 6. Xử lý Ngoại Lệ (Error Handling & HTTP Code)

100% Route Handlers dẹp block `try { ... } catch(error) { ... }`:

- `200`: Lấy data thành công chuẩn nhịp.
- `201`: Hành vi POST/Update thành công.
- `400 (Bad Request)`: Sai Zod schema, Thiếu field bắt buộc, Lỗi logic của User,...
- `401 (Unauthorized)`: Thiếu token đăng nhập (Mất Session NextAuth).
- `403 (Forbidden)`: Có Session nhưng cấm thao tác (Period Locked, user cố update Comcode của thằng khác).
- `404 (Not Found)`: Truy vấn Object ID không tồn tại.
- `500 (Internal Server Error)`: Lắm lúc crash server, catch rớt database => Catch trả về dòng generic: Error, log backend lưu vết.

---

## 7. Checklist Nhanh khi tạo 1 API Mới

```text
[ ] API có bao bọc kẹp chả trong try...catch chuẩn chưa?
[ ] Input có quét qua Zod parser chưa?
[ ] Query prisma có đang lỡ tay select * thừa mứa không?
[ ] Có hàm check `assertPeriodOpen` trước khi chạy lệnh modify DB không?
[ ] Lệnh Prisma Insert/Update có nhét vô Transaction phòng hờ crash đứt gánh chưa?
[ ] Bất cứ ID nào cũng đã kẹp check kèm Filter `comcode` của Auth User hiện tại chưa?
[ ] Toán học tiền nong đã bọc bằng `new Decimal(val).add()` chưa?
[ ] Có bung HTTP Code đúng nghĩa chưa, Response json có bám chặt chuẩn ApiResponse không?
```
