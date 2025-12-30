import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/reward_model.dart';
import '../../providers/reward_provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/constants.dart';
import '../../utils/helpers.dart';
import '../../widgets/reward_card.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/empty_state.dart';
import 'reward_detail_screen.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({super.key});

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  @override
  void initState() {
    super.initState();
    _loadRewards();
  }

  Future<void> _loadRewards() async {
    final rewardProvider = Provider.of<RewardProvider>(context, listen: false);
    await rewardProvider.fetchRewards();
  }

  Future<void> _refresh() async {
    await _loadRewards();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.rewards),
        actions: [
          // Hiển thị điểm hiện tại
          Consumer<AuthProvider>(
            builder: (context, authProvider, _) {
              final points = authProvider.user?.points ?? 0;
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                child: Row(
                  children: [
                    const Icon(Icons.stars, color: AppColors.accent),
                    const SizedBox(width: AppSpacing.xs),
                    Text(
                      Helpers.formatPoints(points),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: Consumer<RewardProvider>(
        builder: (context, rewardProvider, _) {
          if (rewardProvider.isLoading && rewardProvider.rewards.isEmpty) {
            return const LoadingWidget(message: 'Đang tải phần thưởng...');
          }

          if (rewardProvider.error != null && rewardProvider.rewards.isEmpty) {
            return EmptyState(
              icon: Icons.error_outline,
              message: rewardProvider.error!,
              actionText: 'Thử lại',
              onAction: _loadRewards,
            );
          }

          if (rewardProvider.rewards.isEmpty) {
            return const EmptyState(
              icon: Icons.card_giftcard,
              message: 'Chưa có phần thưởng nào',
            );
          }

          return RefreshIndicator(
            onRefresh: _refresh,
            child: GridView.builder(
              padding: const EdgeInsets.all(AppSpacing.md),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: AppSpacing.md,
                mainAxisSpacing: AppSpacing.md,
              ),
              itemCount: rewardProvider.rewards.length,
              itemBuilder: (context, index) {
                final reward = rewardProvider.rewards[index];
                return RewardCard(
                  reward: reward,
                  onTap: () => _showRewardDetail(reward),
                );
              },
            ),
          );
        },
      ),
    );
  }

  void _showRewardDetail(RewardModel reward) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => RewardDetailScreen(reward: reward),
      ),
    );
  }
}
