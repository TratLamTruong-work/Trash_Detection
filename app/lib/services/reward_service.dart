import '../models/reward_model.dart';
import '../models/trade_history_model.dart';
import '../utils/constants.dart';
import 'api_service.dart';

class RewardService {
  static Future<List<RewardModel>> getAllRewards() async {
    final response = await ApiService.get('${ApiConfig.rewardsUrl}');

    if (response['success'] == true && response['data'] != null) {
      final List rewards = response['data'];
      return rewards.map((r) => RewardModel.fromJson(r)).toList();
    }

    return [];
  }

  static Future<Map<String, dynamic>> tradeReward({
    required String itemId,
    int quantity = 1,
  }) async {
    final response = await ApiService.post(
      '${ApiConfig.rewardsUrl}/trade',
      {
        'itemId': itemId,
        'quantity': quantity,
      },
      auth: true,
    );

    return response;
  }

  static Future<List<TradeHistoryModel>> getTradeHistory() async {
    final response = await ApiService.get(
      '${ApiConfig.rewardsUrl}/history/me',
      auth: true,
    );

    if (response['success'] == true && response['data'] != null) {
      final List history = response['data'];
      return history.map((h) => TradeHistoryModel.fromJson(h)).toList();
    }

    return [];
  }
}
