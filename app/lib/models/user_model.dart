class UserModel {
  final String id;
  final String userName;
  final String firstName;
  final String lastName;
  final String email;
  final DateTime birthDate;
  final bool male;
  final int points;
  final String iconUrl;

  UserModel({
    required this.id,
    required this.userName,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.birthDate,
    required this.male,
    required this.points,
    required this.iconUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'] ?? '',
      userName: json['userName'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      email: json['email'] ?? '',
      birthDate: DateTime.parse(json['birthDate']),
      male: json['male'] ?? true,
      points: json['points'] ?? 0,
      iconUrl: json['iconUrl'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userName': userName,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'birthDate': birthDate.toIso8601String(),
      'male': male,
      'points': points,
      'iconUrl': iconUrl,
    };
  }

  String get fullName => '$firstName $lastName';

  // Copy with method
  UserModel copyWith({
    String? id,
    String? userName,
    String? firstName,
    String? lastName,
    String? email,
    DateTime? birthDate,
    bool? male,
    int? points,
    String? iconUrl,
  }) {
    return UserModel(
      id: id ?? this.id,
      userName: userName ?? this.userName,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      birthDate: birthDate ?? this.birthDate,
      male: male ?? this.male,
      points: points ?? this.points,
      iconUrl: iconUrl ?? this.iconUrl,
    );
  }
}
