# Plan2Predict / LedgerFlow Studio

Plan2Predict là web học tập dạng dashboard + sandbox mô phỏng cho kế toán, thuế, kiểm toán dữ liệu, data science và AI/ML. Đây không phải là phần mềm kế toán vận hành thật.

## Stack

- React 19 + Vite
- TypeScript
- Express server
- Gemini API qua backend `/api/gemini/generate`
- Recharts, Lucide, Tailwind CSS

## Chạy local

Yêu cầu: Node.js 22 hoặc mới hơn.

```bash
npm install
```

Tạo file `.env.local` hoặc set biến môi trường:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

Chạy dev:

```bash
npm run dev
```

Build production:

```bash
npm run build
npm run start
```

## Deploy khuyến nghị

### Phương án A - Google Cloud Run

Phù hợp nhất vì repo có cả frontend và Express backend.

Cấu hình cần có:

- Service name: `plan2predict`
- Region: `asia-southeast1`
- Runtime: Node.js 22
- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Environment variables:
  - `NODE_ENV=production`
  - `GEMINI_API_KEY=...`
  - `GEMINI_MODEL=gemini-2.5-flash`

### Phương án B - Firebase Hosting + Cloud Run

Dùng Firebase Hosting làm lớp website/tên miền, Cloud Run chạy backend và serve app. Hướng này phù hợp nếu muốn URL Firebase hoặc custom domain ngắn.

Luồng đề xuất:

```text
GitHub repo
→ Cloud Run service: plan2predict
→ Firebase Hosting rewrite về Cloud Run
→ Custom domain nếu cần
```

Ví dụ `firebase.json` sau khi đã có Cloud Run service:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "run": {
          "serviceId": "plan2predict",
          "region": "asia-southeast1"
        }
      }
    ]
  }
}
```

Nếu chỉ dùng Firebase Hosting tĩnh thì API Gemini trong `server.ts` sẽ không chạy. Vì vậy dự án này nên dùng Cloud Run hoặc Firebase Hosting kết hợp Cloud Run.

## Ghi chú bảo mật

Không commit `GEMINI_API_KEY` vào GitHub. Luôn lưu key trong biến môi trường của Cloud Run/Firebase/Google Cloud Console.
