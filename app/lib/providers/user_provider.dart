import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/user_service.dart';

class UserProvider extends ChangeNotifier {
  UserModel? _user;
  int _points = 0;
  bool _isLoading = false;
  String? _error;

  UserModel? get user => _user;
  int get points => _points;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchProfile() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await UserService.getProfile();
      _points = _user?.points ?? 0;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
    DateTime? birthDate,
    bool? male,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await UserService.updateProfile(
        firstName: firstName,
        lastName: lastName,
        email: email,
        birthDate: birthDate,
        male: male,
      );
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchPoints() async {
    try {
      _points = await UserService.getPoints();
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  void updatePoints(int newPoints) {
    _points = newPoints;
    if (_user != null) {
      _user = UserModel(
        id: _user!.id,
        userName: _user!.userName,
        firstName: _user!.firstName,
        lastName: _user!.lastName,
        email: _user!.email,
        birthDate: _user!.birthDate,
        male: _user!.male,
        points: newPoints,
        iconUrl: _user!.iconUrl,
      );
    }
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
