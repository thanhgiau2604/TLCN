var str = "       PHẦN MỘT. LỊCH SỬ THẾ GIỚI THỜI NGUYÊN THỦY, CỔ ĐẠI VÀ TRUNG ĐẠI";
str = str.toLowerCase();
str = str.trim();
const newStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
console.log(newStr)