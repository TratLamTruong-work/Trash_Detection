import '../models/user_model.dart';
import '../utils/constants.dart';
import 'api_service.dart';

class UserService {
  static Future<UserModel> getProfile() async {
    final response = await ApiService.get(
      '${ApiConfig.userUrl}/profile',
      auth: true,
    );

    if (response['success'] == true && response['data'] != null) {
      return UserModel.fromJson(response['data']);
    }

    throw Exception('Không thể lấy thông tin người dùng');
  }

  static Future<UserModel> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
    DateTime? birthDate,
    bool? male,
  }) async {
    final body = <String, dynamic>{};
    if (firstName != null) body['firstName'] = firstName;
    if (lastName != null) body['lastName'] = lastName;
    if (email != null) body['email'] = email;
    if (birthDate != null) body['birthDate'] = birthDate.toIso8601String();
    if (male != null) body['male'] = male;

    final response = await ApiService.put(
      '${ApiConfig.userUrl}/profile',
      body,
      auth: true,
    );

    if (response['success'] == true && response['data'] != null) {
      return UserModel.fromJson(response['data']);
    }

    throw Exception('Không thể cập nhật thông tin');
  }

  static Future<int> getPoints() async {
    final response = await ApiService.get(
      '${ApiConfig.userUrl}/points',
      auth: true,
    );

    if (response['success'] == true && response['data'] != null) {
      return response['data']['points'] as int;
    }

    return 0;
  }
}
