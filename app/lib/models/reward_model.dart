class RewardModel {
  final String id;
  final String name;
  final int pointToTrade;
  final String imageUrl;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  RewardModel({
    required this.id,
    required this.name,
    required this.pointToTrade,
    required this.imageUrl,
    this.createdAt,
    this.updatedAt,
  });

  factory RewardModel.fromJson(Map<String, dynamic> json) {
    return RewardModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      pointToTrade: json['pointToTrade'] ?? 0,
      imageUrl: json['imageUrl'] ?? '',
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'pointToTrade': pointToTrade,
      'imageUrl': imageUrl,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
}
