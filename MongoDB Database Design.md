# 1. Nhúng, Tham chiếu

Cái tên nói nên tất cả

# 2. Các loại quan hệ

1. Quan hệ `1`- `1`

   (sử dụng một cặp key - value)

2. Quan hệ `1` - `ít`

   (bên `1 ` nhúng array chứa dữ liệu của bên `ít`)

3. Quan hệ `1` - `nhiều`

   (bên `1` nhúng array tham chiếu đến bên `nhiều`)

4. Quan hệ `1` - `rất nhiều`

   (bên `rất nhiều` tham chiếu đến bên `1`)

5. Quan hệ `nhiều` - `nhiều`

   (`cả hai bên` điều nhúng array tham chiếu ID)

# 3. Một số lưu ý

- Tên collection nên được đặt theo dạng số nhiều
- Tên field nên được đặt theo dạng snake_case
- \_id là trường do MongoDB tự động tạo ra và có kiểu ObjectID
- Trường created_at, updated_at nên có kiểu Date
- Tất cả trường đại diện

# 4. Thiết kế schema Twitter theo MongoDB

## Colection Users

- Đăng kí
- Đăng nhập
- Xác thực email
- Quên mật khẩu
- Đổi mật khẩu
- Cập nhật thông tin

```ts
enum UserVerifyStatus {
  // chưa xác thực email
  Unverified,
  // đã xác thực email
  Verified,
  // đã bị khóa
  Banned
}

interface User {
  _id: ObjectId

  // Đăng kí: username, email, date of birth, password
  // Đăng nhập: email và password
  username: string
  email: string
  date_of_birth: Date
  password: string

  // Xác thực email: jwt nếu chưa xác thực, '' khi đã xác thực
  email_verify_token: string

  // Quên mật khẩu: jwt nếu chưa xác thực, '' khi đã xác thực
  forgot_password_token: string

  // Thông tin người dùng có thể cập nhật thêm
  bio: string
  avatar: string
  cover_photo: string

  // Quản lý trạng thái tài khoản
  verify: UserVerifyStatus

  // Quản lý thời gian tạo và cập nhập tài khoản
  created_at: Date
  updated_at: Date
}
```

## Colection Refresh_token

- Đăng nhập: tạo mới 1 rf token
- Đăng xuất: xóa rf token
- As token hết hạn: xòa rf token cũ, tạo as token và rf token mới
- Đổi mật khẩu: xóa tất cả rf token liên quan đến user
- DB sẽ tự động xóa các rf token hết hạn

- User vs Refresh_Token: mỗi khi đăng nhập sẽ tạo ra một rf token, đăng nhập ở nhiều máy, nhiều trình duyệt, không giới hạn só lần đăng nhập
  --> Quan hệ 1 (users) - rất nhiều (rf token)

```ts
interface Refresh_token {
  _id: ObjectId

  // Những thông tin cân thiết
  user_id: string
  token: string

  // Quản lý thời gian tạo
  created_at: Date
}
```
