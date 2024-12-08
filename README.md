# Trọ Số
Trọ số là một hệ thống quản lý phòng tìm kiếm phòng trọ. Đây là một ứng dụng web cho phép bên thuê và cho thuê kết nối với nhau. Chủ sở hữu có thể đăng phòng cho thuê, quản lý người ở, đăng ký thanh toán tiền thuê và tạo hợp đồng thuê phòng. Người ở trọ có thể tìm kiếm và lọc phòng, xem chi tiết phòng, gửi email cho chủ phòng và sử dụng ứng dụng trò chuyện tích hợp để liên lạc giữa chủ phòng và người ở trọ.
## Tính năng
- Đăng phòng cho thuê
- Tìm kiếm và lọc phòng
- Xem chi tiết phòng
- Ứng dụng trò chuyện tích hợp để liên lạc giữa chủ sở hữu và người ở trọ
- Xác thực JWT an toàn bằng cách sử dụng mã thông báo truy cập và làm mới
- Gửi email giữa chủ sở hữu và người ở trọ
- Tạo hợp đồng phòng
- Quản lý người ở trọ
- Đăng ký thanh toán tiền thuê nhà
## Hướng dẫn cấu hình và cài đặt
### Điều kiện tiên quyết
- [Node.js](https://nodejs.org/en/download/)
- [React.js](https://facebook.github.io/react/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Ethereal Email](https://ethereal.email/)
1. Clone hoặc tải bản zip project về
2. Định cấu hình các biến môi trường bên trong thư mục server:
- Tạo tệp .env chứa các nội dung sau:
```bash
MONGO_URI= 
ACCESS_TOKEN_SECRET_OWNER= 
ACCESS_TOKEN_SECRET_TENANT= 
REFRESH_TOKEN_SECRET_OWNER= 
REFRESH_TOKEN_SECRET_TENANT= 
ACCESS_LIFETIME=15m
REFRESH_LIFETIME=7d
CLOUDINARY_API_KEY= 
CLOUDINARY_API_SECRET= 
RESET_PASSWORD_KEY= 
EMAIL_VERIFICATION_KEY= 
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER= 
EMAIL_PASS= 
```
3. Định cấu hình các biến môi trường bên trong thư mục client:
- Tạo tệp .env.local chứa các nội dung sau:
```bash
VITE_APP_BASE_URL=http://localhost:3000
VITE_APP_API_URL=http://localhost:5000/api
VITE_APP_API_HOST=http://localhost:5000
```
4. Khởi chạy chương trình:
```bash
$ cd server
$ npm run dev
```
