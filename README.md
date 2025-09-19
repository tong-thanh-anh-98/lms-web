# lms-web: Learning Management System (LMS)

# Installs Backend:

- Laravel Sanctum: php artisan install:api
- Installing Intervention Image: composer require intervention/image

// Kiểm tra xem người dùng đã đăng ký khóa học chưa
// Hiển thị tất cả các chương và bài học ở thanh bên phải
// nếu không có hoạt động nào được lưu thì hiển thị bài học đầu tiên của chương đầu tiên
// nếu hoạt động đã lưu thì hiển thị bài học đã xem lần trước
// nếu người dùng nhấp vào bài học thì lưu hoạt động của bài học đó dưới dạng bài học đã xem gần đây nhất
// nếu người dùng nhấp vào đánh dấu là hoàn thành thì đánh dấu bài học đó là hoàn thành
// và dựa trên các bài học đã hoàn thành hiển thị là đã hoàn thành

// Check if user enrolled in the course
// Show all chapters and lessons in right sidebar
// if no activity saved then show first lesson of first chapter
// if activity saved then show the lesson that was watched last time
// if user click on lesson then store it's activity as last watched lesson
// if user click on mark as complete then mark that lesson as complete
// and based on completed lessons show as completed
