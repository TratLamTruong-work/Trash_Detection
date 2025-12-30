import 'package:flutter/material.dart';

class ApiConfig {
  static const String baseUrl = "http://127.0.0.1:5000/api";
  static const String authUrl = "$baseUrl/auth";
  static const String userUrl = "$baseUrl/user";
  static const String rewardsUrl = "$baseUrl/rewards";
  static const String qrUrl = "$baseUrl/qr";
}

class AppStrings {
  static const String appName = "Phát hiện Rác";

  static const String login = "Đăng nhập";
  static const String register = "Đăng ký";
  static const String logout = "Đăng xuất";
  static const String userName = "Tên đăng nhập";
  static const String password = "Mật khẩu";
  static const String firstName = "Tên";
  static const String lastName = "Họ";
  static const String email = "Email";
  static const String birthDate = "Ngày sinh";
  static const String male = "Nam";
  static const String female = "Nữ";
  static const String gender = "Giới tính";

  static const String home = "Trang chủ";
  static const String rewards = "Phần thưởng";
  static const String scanQR = "Quét QR";
  static const String profile = "Hồ sơ";
  static const String history = "Lịch sử";

  static const String points = "điểm";
  static const String yourPoints = "Điểm của bạn";
  static const String pointsEarned = "Điểm nhận được";
  static const String pointsSpent = "Điểm đã dùng";

  static const String rewardsList = "Danh sách phần thưởng";
  static const String trade = "Đổi thưởng";
  static const String tradeHistory = "Lịch sử đổi thưởng";
  static const String tradeSuccess = "Đổi thưởng thành công";

  static const String scanQRCode = "Quét mã QR";
  static const String generateQR = "Tạo mã QR";
  static const String scanSuccess = "Quét mã thành công";

  static const String save = "Lưu";
  static const String cancel = "Hủy";
  static const String confirm = "Xác nhận";
  static const String error = "Lỗi";
  static const String success = "Thành công";
  static const String loading = "Đang tải...";
  static const String noData = "Không có dữ liệu";
  static const String update = "Cập nhật";
}

class AppColors {
  static const Color primary = Color(0xFF4CAF50);
  static const Color secondary = Color(0xFF2196F3);
  static const Color accent = Color(0xFFFFC107);
  static const Color error = Color(0xFFF44336);
  static const Color success = Color(0xFF4CAF50);
  static const Color text = Color(0xFF212121);
  static const Color textLight = Color(0xFF757575);
  static const Color background = Color(0xFFFAFAFA);
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
}

class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;
}

class AppBorderRadius {
  static const double sm = 4.0;
  static const double md = 8.0;
  static const double lg = 12.0;
  static const double xl = 16.0;
  static const double xxl = 24.0;
}

class StorageKeys {
  static const String accessToken = "access_token";
  static const String refreshToken = "refresh_token";
  static const String userData = "user_data";
}
