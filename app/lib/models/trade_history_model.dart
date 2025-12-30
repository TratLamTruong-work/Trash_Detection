import 'reward_model.dart';

class TradeHistoryModel {
  final String id;
  final String userId;
  final String itemId;
  final String itemName;
  final int quantity;
  final int pointsSpent;
  final int prevPoint;
  final int remainPoint;
  final DateTime createdAt;
  final RewardModel? item; // Populated item data

  TradeHistoryModel({
    required this.id,
    required this.userId,
    required this.itemId,
    required this.itemName,
    required this.quantity,
    required this.pointsSpent,
    required this.prevPoint,
    required this.remainPoint,
    required this.createdAt,
    this.item,
  });

  factory TradeHistoryModel.fromJson(Map<String, dynamic> json) {
    return TradeHistoryModel(
      id: json['_id'] ?? json['id'] ?? '',
      userId: json['userId'] ?? '',
      itemId: json['itemId'] is String ? json['itemId'] : json['itemId']?['_id'] ?? '',
      itemName: json['itemName'] ?? '',
      quantity: json['quantity'] ?? 1,
      pointsSpent: json['pointsSpent'] ?? 0,
      prevPoint: json['prevPoint'] ?? 0,
      remainPoint: json['remainPoint'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
      item: json['itemId'] is Map ? RewardModel.fromJson(json['itemId']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'itemId': itemId,
      'itemName': itemName,
      'quantity': quantity,
      'pointsSpent': pointsSpent,
      'prevPoint': prevPoint,
      'remainPoint': remainPoint,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
