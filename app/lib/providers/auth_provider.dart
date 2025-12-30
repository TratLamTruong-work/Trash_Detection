import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;
  bool _isAuthenticated = false;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;

  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();

    final isLoggedIn = await AuthService.isLoggedIn();
    if (isLoggedIn) {
      _user = await AuthService.getUserData();
      _isAuthenticated = _user != null;
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> signUp({
    required String userName,
    required String password,
    required String firstName,
    required String lastName,
    required String email,
    required DateTime birthDate,
    required bool male,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await AuthService.signUp(
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthDate: birthDate,
        male: male,
      );

      if (response['success'] == true && response['data'] != null) {
        _user = UserModel.fromJson(response['data']['user']);
        _isAuthenticated = true;
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signIn({
    required String userName,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await AuthService.signIn(
        userName: userName,
        password: password,
      );

      if (response['success'] == true && response['data'] != null) {
        _user = UserModel.fromJson(response['data']['user']);
        _isAuthenticated = true;
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signOut() async {
    await AuthService.signOut();
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  void updateUser(UserModel user) {
    _user = user;
    notifyListeners();
  }
}
