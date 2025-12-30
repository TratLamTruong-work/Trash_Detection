import '../utils/constants.dart';
import 'api_service.dart';

class QRService {
  static Future<Map<String, dynamic>> generateQRCode() async {
    final response = await ApiService.post('${ApiConfig.qrUrl}/generate', {});

    return response;
  }

  static Future<Map<String, dynamic>> scanQRCode(String code) async {
    final response = await ApiService.post(
      '${ApiConfig.qrUrl}/scan',
      {'code': code},
      auth: true,
    );

    return response;
  }

  static Future<List<Map<String, dynamic>>> getQRHistory() async {
    final response = await ApiService.get(
      '${ApiConfig.qrUrl}/history/me',
      auth: true,
    );

    if (response['success'] == true && response['data'] != null) {
      return List<Map<String, dynamic>>.from(response['data']);
    }

    return [];
  }
}
