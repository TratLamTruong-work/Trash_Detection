import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../utils/constants.dart';
import 'api_service.dart';

class AuthService {
  static Future<Map<String, dynamic>> signUp({
    required String userName,
    required String password,
    required String firstName,
    required String lastName,
    required String email,
    required DateTime birthDate,
    required bool male,
  }) async {
    final response = await ApiService.post(
      '${ApiConfig.authUrl}/sign-up',
      {
        'userName': userName,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'birthDate': birthDate.toIso8601String(),
        'male': male,
      },
    );

    if (response['success'] == true && response['data'] != null) {
      final accessToken = response['data']['accessToken'];
      final userData = response['data']['user'];

      await ApiService.saveAccessToken(accessToken);
      await _saveUserData(userData);
    }

    return response;
  }

  static Future<Map<String, dynamic>> signIn({
    required String userName,
    required String password,
  }) async {
    final response = await ApiService.post(
      '${ApiConfig.authUrl}/sign-in',
      {
        'userName': userName,
        'password': password,
      },
    );

    if (response['success'] == true && response['data'] != null) {
      final accessToken = response['data']['accessToken'];
      final userData = response['data']['user'];

      await ApiService.saveAccessToken(accessToken);
      await _saveUserData(userData);
    }

    return response;
  }

  static Future<void> signOut() async {
    try {
      await ApiService.post('${ApiConfig.authUrl}/sign-out', {});
    } catch (e) {
    } finally {
      await ApiService.clearAccessToken();
    }
  }

  static Future<void> _saveUserData(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(StorageKeys.userData, json.encode(userData));
  }

  static Future<UserModel?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userDataString = prefs.getString(StorageKeys.userData);

    if (userDataString != null) {
      final userData = json.decode(userDataString);
      return UserModel.fromJson(userData);
    }

    return null;
  }

  static Future<bool> isLoggedIn() async {
    final token = await ApiService.getAccessToken();
    return token != null;
  }
}
