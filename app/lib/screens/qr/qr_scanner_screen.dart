import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../providers/auth_provider.dart';
import '../../services/qr_service.dart';
import '../../utils/constants.dart';
import '../../utils/helpers.dart';
import '../../models/user_model.dart';

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({super.key});

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  MobileScannerController cameraController = MobileScannerController();
  bool _isProcessing = false;

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quét mã QR'),
        actions: [
          IconButton(
            icon: ValueListenableBuilder(
              valueListenable: cameraController.torchState,
              builder: (context, state, child) {
                switch (state) {
                  case TorchState.off:
                    return const Icon(Icons.flash_off);
                  case TorchState.on:
                    return const Icon(Icons.flash_on);
                }
              },
            ),
            onPressed: () => cameraController.toggleTorch(),
            tooltip: 'Bật/tắt đèn flash',
          ),
          IconButton(
            icon: ValueListenableBuilder(
              valueListenable: cameraController.cameraFacingState,
              builder: (context, state, child) {
                return const Icon(Icons.camera_front);
              },
            ),
            onPressed: () => cameraController.switchCamera(),
            tooltip: 'Đổi camera',
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 5,
            child: MobileScanner(
              controller: cameraController,
              onDetect: (capture) {
                final List<Barcode> barcodes = capture.barcodes;
                if (barcodes.isNotEmpty && !_isProcessing) {
                  final String? code = barcodes.first.rawValue;
                  if (code != null) {
                    _handleScan(code);
                  }
                }
              },
            ),
          ),
          Expanded(
            flex: 1,
            child: Container(
              color: AppColors.white,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_isProcessing)
                    const CircularProgressIndicator()
                  else
                    const Column(
                      children: [
                        Icon(Icons.qr_code_scanner,
                            size: 40, color: AppColors.primary),
                        SizedBox(height: AppSpacing.sm),
                        Text(
                          'Đưa mã QR vào khung để quét',
                          style: TextStyle(
                            fontSize: 16,
                            color: AppColors.textLight,
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleScan(String code) async {
    if (_isProcessing) return;

    setState(() => _isProcessing = true);

    // Stop camera
    await cameraController.stop();

    try {
      final response = await QRService.scanQRCode(code);

      if (response['success'] == true && mounted) {
        final data = response['data'];
        final pointsEarned = data['pointsEarned'] ?? 0;
        final currentPoints = data['currentPoints'] ?? 0;

        // Cập nhật điểm cho user
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        if (authProvider.user != null) {
          final updatedUser = UserModel(
            id: authProvider.user!.id,
            userName: authProvider.user!.userName,
            firstName: authProvider.user!.firstName,
            lastName: authProvider.user!.lastName,
            email: authProvider.user!.email,
            birthDate: authProvider.user!.birthDate,
            male: authProvider.user!.male,
            points: currentPoints,
            iconUrl: authProvider.user!.iconUrl,
          );
          authProvider.updateUser(updatedUser);
        }

        // Hiển thị dialog thành công
        if (mounted) {
          _showSuccessDialog(pointsEarned, currentPoints);
        }
      }
    } catch (e) {
      if (mounted) {
        Helpers.showSnackBar(context, e.toString(), isError: true);
        // Resume camera để quét tiếp
        await cameraController.start();
        setState(() => _isProcessing = false);
      }
    }
  }

  void _showSuccessDialog(int pointsEarned, int currentPoints) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: AppColors.success, size: 30),
            SizedBox(width: AppSpacing.sm),
            Text('Quét thành công!'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.stars, color: AppColors.accent, size: 60),
            const SizedBox(height: AppSpacing.md),
            Text(
              '+$pointsEarned điểm',
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: AppColors.accent,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Tổng điểm hiện tại: ${Helpers.formatPoints(currentPoints)}',
              style: const TextStyle(fontSize: 16),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Đóng dialog
              Navigator.pop(context); // Quay lại màn hình trước
            },
            child: const Text('Xong'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context); // Đóng dialog
              // Resume camera để quét tiếp
              await cameraController.start();
              setState(() => _isProcessing = false);
            },
            child: const Text('Quét tiếp'),
          ),
        ],
      ),
    );
  }
}
