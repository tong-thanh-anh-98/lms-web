
# 🚀 Laravel 12 + ReactJS + Docker Setup

Dự án này sử dụng Laravel 12 làm backend và ReactJS (Vite) làm frontend, tất cả được docker hóa với Nginx, MySQL và phpMyAdmin.

## 📁 Cấu trúc thư mục

```
.
├── backend/              # Laravel app
├── frontend/             # ReactJS + Vite
├── docker/
│   ├── php/Dockerfile    # PHP-FPM config
│   ├── nginx/default.conf # Nginx config
│   └── docker-compose.yml
└── README.md
```

## 🧱 Yêu cầu
- Docker & Docker Compose đã cài sẵn
- WSL2 hoặc Linux/macOS

## ⚙️ Cấu hình Laravel `.env` (trong `./backend/.env`)

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=db_lms
DB_USERNAME=root
DB_PASSWORD=root
```

## 🐳 Cách chạy dự án

```bash
docker-compose up -d --build

Để tránh trùng container_name, nên đặt prefix hoặc dùng --project-name:
docker-compose -p lms-web down
docker-compose -p lms-web up -d --build
```

### Truy cập:
- Laravel backend: http://localhost
- React frontend: http://localhost:5173
- PhpMyAdmin: http://localhost:8080 (user: `root`, password: `root`)

### Khởi tạo Laravel project:
```bash
docker exec -it lms-laravel-app composer install
docker exec -it lms-laravel-app php artisan migrate
docker exec -it lms-laravel-app php artisan key:generate
```

## 🔧 Các lệnh hữu ích

```bash
# Xem log container Laravel
docker logs laravel-app

# Vào bash container Laravel
docker exec -it laravel-app bash

# Dừng tất cả container
docker-compose down
or
docker-compose down -v
```
