const currentMaxId = "5c8a24a02f8fb814b56fa193";

// Lấy phần số từ _id bằng cách loại bỏ các ký tự không phải số
const idNumber = parseInt(currentMaxId.replace(/[^\d]/g, ''), 10);

// Tăng thêm 1 để tạo _id mới
const newIdNumber = idNumber + 9;

// Chuyển đổi _id mới thành dạng chuỗi và thêm các ký tự "0" vào đầu cho đủ chiều dài (12 ký tự)
const newId = String(newIdNumber).padStart(12, '0');

// Thêm ký tự ObjectId năm vào đầu _id mới
const newObjectId = "5c" + newId;

console.log(newObjectId); // Kết quả: "5c8a24a02f8fb814b56fa194"