import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../../models/reward_model.dart';
import '../../providers/reward_provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/constants.dart';
import '../../utils/helpers.dart';
import '../../widgets/custom_button.dart';

class RewardDetailScreen extends StatefulWidget {
  final RewardModel reward;

  const RewardDetailScreen({super.key, required this.reward});

  @override
  State<RewardDetailScreen> createState() => _RewardDetailScreenState();
}

class _RewardDetailScreenState extends State<RewardDetailScreen> {
  int _quantity = 1;
  bool _isTrading = false;

  int get _totalPoints => widget.reward.pointToTrade * _quantity;

  Future<void> _handleTrade() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userPoints = authProvider.user?.points ?? 0;

    // Kiểm tra điểm đủ không
    if (userPoints < _totalPoints) {
      Helpers.showSnackBar(
        context,
        'Bạn không đủ điểm! Cần ${Helpers.formatPoints(_totalPoints)} điểm.',
        isError: true,
      );
      return;
    }

    // Xác nhận
    final confirmed = await Helpers.showConfirmDialog(
      context,
      'Xác nhận đổi thưởng',
      'Bạn có chắc muốn đổi ${widget.reward.name} với ${Helpers.formatPoints(_totalPoints)} điểm?',
    );

    if (!confirmed) return;

    setState(() => _isTrading = true);

    try {
      final rewardProvider = Provider.of<RewardProvider>(context, listen: false);
      final success = await rewardProvider.tradeReward(
        widget.reward.id,
        _quantity,
      );

      if (success && mounted) {
        // Cập nhật điểm mới
        final newPoints = userPoints - _totalPoints;
        authProvider.updateUser(
          authProvider.user!.copyWith(points: newPoints),
        );

        Helpers.showSnackBar(context, 'Đổi thưởng thành công!');
        Navigator.pop(context);
      } else if (mounted) {
        Helpers.showSnackBar(
          context,
          rewardProvider.error ?? 'Đổi thưởng thất bại',
          isError: true,
        );
      }
    } catch (e) {
      if (mounted) {
        Helpers.showSnackBar(context, e.toString(), isError: true);
      }
    } finally {
      if (mounted) {
        setState(() => _isTrading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final userPoints = authProvider.user?.points ?? 0;
    final canAfford = userPoints >= _totalPoints;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Chi tiết phần thưởng'),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Image
                  CachedNetworkImage(
                    imageUrl: widget.reward.imageUrl,
                    height: 250,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      height: 250,
                      color: AppColors.background,
                      child: const Center(child: CircularProgressIndicator()),
                    ),
                    errorWidget: (context, url, error) => Container(
                      height: 250,
                      color: AppColors.background,
                      child: const Icon(Icons.card_giftcard, size: 80),
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Name
                        Text(
                          widget.reward.name,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // Points
                        Row(
                          children: [
                            const Icon(Icons.stars, color: AppColors.accent, size: 28),
                            const SizedBox(width: AppSpacing.sm),
                            Text(
                              '${Helpers.formatPoints(widget.reward.pointToTrade)} ${AppStrings.points}',
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: AppColors.accent,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.lg),

                        // Quantity selector
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(AppSpacing.md),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Số lượng:',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: AppSpacing.sm),
                                Row(
                                  children: [
                                    IconButton(
                                      onPressed: _quantity > 1
                                          ? () => setState(() => _quantity--)
                                          : null,
                                      icon: const Icon(Icons.remove_circle_outline),
                                      color: AppColors.primary,
                                    ),
                                    Expanded(
                                      child: Text(
                                        '$_quantity',
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    IconButton(
                                      onPressed: () => setState(() => _quantity++),
                                      icon: const Icon(Icons.add_circle_outline),
                                      color: AppColors.primary,
                                    ),
                                  ],
                                ),
                                const Divider(),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Tổng điểm:'),
                                    Row(
                                      children: [
                                        const Icon(Icons.stars,
                                            color: AppColors.accent, size: 20),
                                        const SizedBox(width: AppSpacing.xs),
                                        Text(
                                          Helpers.formatPoints(_totalPoints),
                                          style: const TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold,
                                            color: AppColors.accent,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: AppSpacing.md),

                        // User points
                        Card(
                          color: canAfford ? AppColors.success.withOpacity(0.1) : AppColors.error.withOpacity(0.1),
                          child: Padding(
                            padding: const EdgeInsets.all(AppSpacing.md),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Điểm của bạn:'),
                                Row(
                                  children: [
                                    Icon(
                                      canAfford ? Icons.check_circle : Icons.error,
                                      color: canAfford ? AppColors.success : AppColors.error,
                                      size: 20,
                                    ),
                                    const SizedBox(width: AppSpacing.xs),
                                    Text(
                                      Helpers.formatPoints(userPoints),
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: canAfford ? AppColors.success : AppColors.error,
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
                  ),
                ],
              ),
            ),
          ),

          // Trade button
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: AppColors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: SafeArea(
              child: CustomButton(
                text: AppStrings.trade,
                icon: Icons.card_giftcard,
                onPressed: canAfford ? _handleTrade : () {},
                isLoading: _isTrading,
                backgroundColor: canAfford ? AppColors.primary : AppColors.textLight,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
