import { WeekTask } from '../types';

export const ROADMAP_WEEKS: WeekTask[] = [
  {
    week: 1,
    phase: 'Chuẩn bị (Setup & Backup)',
    title: 'Khóa bản gốc & Thiết lập môi trường',
    description: 'Bảo vệ mã gốc của bạn trước khi cho bất kỳ AI nào chỉnh sửa. Chuẩn bị Git và các setup cơ bản nhất.',
    tasks: [
      {
        id: 'git_repo',
        text: 'Tạo tài khoản GitHub và thiết lập một Repository Private mang tên ke-toan-web.',
        subText: 'Đảm bảo không lộ thông tin dữ liệu của dự án ra công khai.'
      },
      {
        id: 'backup_desktop',
        text: 'Nén zip phiên bản app desktop cũ (Tkinter), tải lên Google Drive / OneDrive cất trữ.',
        subText: 'Khóa bản cứng để làm điểm tì an toàn phòng hờ lỗi hoại.'
      },
      {
        id: 'env_setup',
        text: 'Thiết lập môi trường làm việc VS Code và cài đặt Python 3.11+.',
        subText: 'Cài đặt extension Python, Pylance, Rest Client.'
      },
      {
        id: 'gitignore',
        text: 'Tạo file .gitignore ngăn không cho tệp .env và tệp .db lọt vào GitHub.',
        subText: 'Đây là quy tắc xương sống về bảo mật mã nguồn.'
      }
    ],
    tip: 'Đặc thù kế toán VN: hãy chuẩn bị mã số thuế thật của 2-3 nhà cung cấp tin cậy để làm dữ liệu mẫu.',
    completionVerify: 'Thực sữ gõ "git status" trong Terminal của VS Code thấy sạch, tệp .env đã bị lờ đi.'
  },
  {
    week: 2,
    phase: 'Hạ tầng (Core Backend)',
    title: 'Khởi chạy Flask Local & Kết nối SQLite',
    description: 'Xây dựng trục xương sống Backend. Không tạo giao diện vội - tập trung vào API trả dữ liệu chuẩn JSON.',
    tasks: [
      {
        id: 'flask_hello',
        text: 'Viết app.py cơ bản và đăng ký một route kiểm tra sòng sực /api/health.',
        subText: 'Dùng lệnh pip install flask flask-cors python-dotenv.'
      },
      {
        id: 'sqlite_schema',
        text: 'Khởi tạo File schema.sql định nghĩa ba bảng cơ bản: expenses, projects, và vendors.',
        subText: 'Dùng cột kiểu INTEGER thay cho FLOAT để tính số tiền chính xác không sai lệch.'
      },
      {
        id: 'db_py',
        text: 'Viết file database.py bọc hàm connect thông qua helper execute_query().',
        subText: 'Đảm bảo thread-safe trong môi trường chạy phục vụ nhiều request.'
      },
      {
        id: 'rest_client_test',
        text: 'Viết file requests.http để kiểm nghiệm việc gửi nhận dữ liệu mà không cần trình duyệt.',
        subText: 'Test endpoints: GET /api/expenses và POST /api/expenses.'
      }
    ],
    tip: 'Khi chạy SQLite trên Windows, nếu gặp lỗi "database is locked" hãy cấu hình PRAGMA journal_mode=WAL; để cho phép đọc ghi đồng thời.',
    completionVerify: 'Gửi request POST tạo mới chi phí từ file .http nhận được phản hồi {"success": true, "id": 1}.'
  },
  {
    week: 3,
    phase: 'MVP (Front & Back Integration)',
    title: 'Hoàn thiện Giao diện & Nghiệp vụ chi phí',
    description: 'Đây là mốc quan trọng nhất của MVP. Xây dựng trang nhập liệu thực tế tự động tính toán tiền trước thuế, VAT, và tổng tiền.',
    tasks: [
      {
        id: 'api_expenses_full',
        text: 'Đăng ký đủ 5 API API CRUD cho chi phí dầm: list, detail, create, update, soft_delete.',
        subText: 'Đặc biệt validate: đơn giá > 0, VAT in [0, 5, 8, 10].'
      },
      {
        id: 'html_expenses',
        text: 'Nhờ Claude thiết kế một file expenses.html dùng Tailwind CDN đẹp mắt.',
        subText: 'Form nhập liệu kết hợp tự tính thành tiền khi gõ đơn giá và số lượng.'
      },
      {
        id: 'sheetjs_export',
        text: 'Nhúng thư viện SheetJS qua CDN để xuất File Excel trực quan ngay trên trình duyệt.',
        subText: 'Tránh việc xử lý tốn tài nguyên trên backend khi xuất đính kèm.'
      },
      {
        id: 'data_verify_mvp',
        text: 'Đối chiếu kết quả tính toán thành tiền của 10 phiếu chi tiêu mẫu với file Excel kế toán cũ.',
        subText: 'Hai bên phải khớp chuẩn chính xác từng đồng VNĐ.'
      }
    ],
    tip: 'Trong file JS gọi API, luôn format tiền bằng cách dùng Intl.NumberFormat("vi-VN") để người dùng dễ nhìn.',
    completionVerify: 'Có thể vào giao diện web, gõ 150.5 kg thép đính kèm giá 15.000đ và VAT 10% ra đúng 2.483.250đ và lưu thành công.'
  },
  {
    week: 5,
    phase: 'Bảo mật (Audit & Auth)',
    title: 'Xác thực JWT, Phân quyền & Lịch sử sửa đổi (Audit Log)',
    description: 'Bảo vệ dữ liệu doanh nghiệp an toàn. Tuyệt đối không đưa vào dùng thật khi chưa kích hoạt cơ chế truy vết hành vi người dùng.',
    tasks: [
      {
        id: 'user_hash',
        text: 'Tạo bảng users và mã hóa mật khẩu thô bằng thư viện bcrypt.',
        subText: 'Tuyệt đối không lưu plain text mật khẩu vào DB.'
      },
      {
        id: 'jwt_middle',
        text: 'Viết decorator yêu cầu kiểm tra token Bearer trong header của mọi API nghiệp vụ.',
        subText: 'Trả về mã lỗi HTTP 401 nếu token rỗng hoặc hết hạn.'
      },
      {
        id: 'audit_log_sql',
        text: 'Tạo bảng audit_logs lưu lại thông tin sửa đổi: ID tài khoản thay đổi, thao tác, dữ liệu cũ và mới kiểu JSON.',
        subText: 'Mỗi thao tác sửa/xóa chi phí phải tự động chèn vào bảng này.'
      },
      {
        id: 'backup_auto',
        text: 'Viết script python backup.py tự động gọi SQLite ".backup" lúc 23:00 hằng ngày.',
        subText: 'Test thử khôi phục từ tệp vừa backup xem dữ liệu có nguyên vẹn không.'
      }
    ],
    tip: 'Lưu trữ tệp .db hoặc .sql backup trên một thiết bị tách biệt (hoặc Google Drive liên kết) đề phòng ổ cứng máy chủ hỏng hóc vật lý.',
    completionVerify: 'Đăng nhập bằng tài khoản "viewer" thử bấm sửa chi phí bị hệ thống trả về mã lỗi chặn quyền.'
  },
  {
    week: 8,
    phase: 'Deploy (Cloud Provision)',
    title: 'Đưa ứng dụng lên Cloud (Firebase & Render) - 0đ',
    description: 'Chuyển đổi hạ tầng lên Internet. Đồng bộ hóa database PostgreSQL miễn phí từ nhà cung cấp Supabase.',
    tasks: [
      {
        id: 'supabase_postgres',
        text: 'Đăng ký dự án Supabase miễn phí tại Singapore, lấy connection URI.',
        subText: 'Nhờ Cloud AI viết script chuyển đổi dữ liệu hiện hữu từ SQLite dạng .db lên Postgres.'
      },
      {
        id: 'render_flask',
        text: 'Deploy backend Flask lên Render.com liên kết trực tiếp bằng tài khoản Github.',
        subText: 'Khai báo các biến môi trường nhạy cảm DATABASE_URL, SECRET_KEY an toàn trên Render.'
      },
      {
        id: 'firebase_front',
        text: 'Đẩy toàn bộ files HTML/JS tĩnh lên Firebase Hosting bằng lệnh firebase deploy.',
        subText: 'Dùng Cloudflare Pages làm giải pháp thay thế nếu muốn tối ưu băng thông.'
      },
      {
        id: 'cors_patch',
        text: 'Giải quyết lỗi chặn chéo nguồn CORS bằng cách cấu hình danh sách trắng tên miền của Firebase vào Flask.',
        subText: 'Test thử đăng nhập và kết xuất dữ liệu trên điện thoại cầm tay.'
      }
    ],
    tip: 'Dịch vụ Render miễn phí sẽ ngủ đông sau 15 phút không có hoạt động. Khi mở app lần đầu sẽ bị trễ tầm 30 giây, nạp một API wake-up nhẹ ở màn hình loading để tăng trải nghiệm.',
    completionVerify: 'Mở trình duyệt điện thoại truy cập qua mạng 4G, vào link .web.app đăng nhập và nhập phiếu chi hoạt động mượt mà.'
  }
];
