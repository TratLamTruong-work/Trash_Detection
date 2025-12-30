import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../services/qr_service.dart';
import '../../utils/constants.dart';
import '../../utils/helpers.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/custom_button.dart';

class QRGeneratorScreen extends StatefulWidget {
  const QRGeneratorScreen({super.key});

  @override
  State<QRGeneratorScreen> createState() => _QRGeneratorScreenState();
}

class _QRGeneratorScreenState extends State<QRGeneratorScreen> {
  String? _qrCode;
  int _points = 5;
  bool _isLoading = false;
  bool _isGenerating = false;

  @override
  void initState() {
    super.initState();
    _generateQR();
  }

  Future<void> _generateQR() async {
    setState(() => _isGenerating = true);

    try {
      final response = await QRService.generateQRCode();

      if (response['success'] == true && response['data'] != null) {
        setState(() {
          _qrCode = response['data']['code'];
          _points = response['data']['points'] ?? 5;
        });
      }
    } catch (e) {
      if (mounted) {
        Helpers.showSnackBar(context, e.toString(), isError: true);
      }
    } finally {
      setState(() => _isGenerating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tạo mã QR'),
      ),
      body: _isGenerating
          ? const LoadingWidget(message: 'Đang tạo mã QR...')
          : SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Info card
                  Card(
                    color: AppColors.primary.withOpacity(0.1),
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      child: Column(
                        children: [
                          const Icon(
                            Icons.info_outline,
                            color: AppColors.primary,
                            size: 40,
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          const Text(
                            'Chia sẻ mã QR này cho người khác quét',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 16),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('Giá trị: '),
                              const Icon(Icons.stars,
                                  color: AppColors.accent, size: 20),
                              const SizedBox(width: AppSpacing.xs),
                              Text(
                                '$_points điểm',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.accent,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // QR Code
                  if (_qrCode != null)
                    Center(
                      child: Container(
                        padding: const EdgeInsets.all(AppSpacing.lg),
                        decoration: BoxDecoration(
                          color: AppColors.white,
                          borderRadius:
                              BorderRadius.circular(AppBorderRadius.lg),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 10,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: QrImageView(
                          data: _qrCode!,
                          version: QrVersions.auto,
                          size: 280.0,
                          backgroundColor: AppColors.white,
                          errorCorrectionLevel: QrErrorCorrectLevel.H,
                        ),
                      ),
                    ),
                  const SizedBox(height: AppSpacing.xl),

                  // QR Code text
                  if (_qrCode != null)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Mã:',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppColors.textLight,
                              ),
                            ),
                            const SizedBox(height: AppSpacing.xs),
                            Text(
                              _qrCode!,
                              style: const TextStyle(
                                fontSize: 12,
                                fontFamily: 'monospace',
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  const SizedBox(height: AppSpacing.lg),

                  // Generate new button
                  CustomButton(
                    text: 'Tạo mã mới',
                    icon: Icons.refresh,
                    onPressed: _generateQR,
                    isLoading: _isLoading,
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Instructions
                  const Card(
                    child: Padding(
                      padding: EdgeInsets.all(AppSpacing.md),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hướng dẫn:',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: AppSpacing.sm),
                          Text('1. Chia sẻ mã QR này cho người khác'),
                          Text('2. Họ quét mã bằng chức năng "Quét QR"'),
                          Text('3. Họ sẽ nhận được điểm thưởng'),
                          SizedBox(height: AppSpacing.sm),
                          Text(
                            'Lưu ý: Mỗi mã QR chỉ sử dụng được 1 lần',
                            style: TextStyle(
                              fontStyle: FontStyle.italic,
                              color: AppColors.textLight,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
