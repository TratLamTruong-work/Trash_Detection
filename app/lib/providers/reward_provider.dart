import 'package:flutter/material.dart';
import '../models/reward_model.dart';
import '../models/trade_history_model.dart';
import '../services/reward_service.dart';

class RewardProvider extends ChangeNotifier {
  List<RewardModel> _rewards = [];
  List<TradeHistoryModel> _tradeHistory = [];
  bool _isLoading = false;
  String? _error;

  List<RewardModel> get rewards => _rewards;
  List<TradeHistoryModel> get tradeHistory => _tradeHistory;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchRewards() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _rewards = await RewardService.getAllRewards();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> tradeReward(String itemId, int quantity) async {
    try {
      await RewardService.tradeReward(itemId: itemId, quantity: quantity);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> fetchTradeHistory() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _tradeHistory = await RewardService.getTradeHistory();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
