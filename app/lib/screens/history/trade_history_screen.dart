import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/reward_provider.dart';
import '../../utils/constants.dart';
import '../../utils/helpers.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/empty_state.dart';

class TradeHistoryScreen extends StatefulWidget {
  const TradeHistoryScreen({super.key});

  @override
  State<TradeHistoryScreen> createState() => _TradeHistoryScreenState();
}

class _TradeHistoryScreenState extends State<TradeHistoryScreen> {
  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final rewardProvider = Provider.of<RewardProvider>(context, listen: false);
    await rewardProvider.fetchTradeHistory();
  }

  Future<void> _refresh() async {
    await _loadHistory();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.tradeHistory),
      ),
      body: Consumer<RewardProvider>(
        builder: (context, rewardProvider, _) {
          if (rewardProvider.isLoading && rewardProvider.tradeHistory.isEmpty) {
            return const LoadingWidget(message: 'Đang tải lịch sử...');
          }

          if (rewardProvider.error != null && rewardProvider.tradeHistory.isEmpty) {
            return EmptyState(
              icon: Icons.error_outline,
              message: rewardProvider.error!,
              actionText: 'Thử lại',
              onAction: _loadHistory,
            );
          }

          if (rewardProvider.tradeHistory.isEmpty) {
            return const EmptyState(
              icon: Icons.history,
              message: 'Chưa có lịch sử đổi thưởng',
            );
          }

          return RefreshIndicator(
            onRefresh: _refresh,
            child: ListView.builder(
              padding: const EdgeInsets.all(AppSpacing.md),
              itemCount: rewardProvider.tradeHistory.length,
              itemBuilder: (context, index) {
                final trade = rewardProvider.tradeHistory[index];
                final item = trade.item;

                return Card(
                  margin: const EdgeInsets.only(bottom: AppSpacing.md),
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Image
                        if (item != null)
                          ClipRRect(
                            borderRadius: BorderRadius.circular(AppBorderRadius.sm),
                            child: CachedNetworkImage(
                              imageUrl: item.imageUrl,
                              width: 60,
                              height: 60,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => Container(
                                width: 60,
                                height: 60,
                                color: AppColors.background,
                                child: const Center(
                                  child: CircularProgressIndicator(),
                                ),
                              ),
                              errorWidget: (context, url, error) => Container(
                                width: 60,
                                height: 60,
                                color: AppColors.background,
                                child: const Icon(Icons.card_giftcard),
                              ),
                            ),
                          )
                        else
                          Container(
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              color: AppColors.background,
                              borderRadius: BorderRadius.circular(AppBorderRadius.sm),
                            ),
                            child: const Icon(Icons.card_giftcard),
                          ),
                        const SizedBox(width: AppSpacing.md),

                        // Content
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                trade.itemName,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.xs),
                              Text(
                                Helpers.formatDateTime(trade.createdAt),
                                style: const TextStyle(
                                  color: AppColors.textLight,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.sm),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: AppSpacing.sm,
                                      vertical: AppSpacing.xs,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppColors.error.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(AppBorderRadius.sm),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(
                                          Icons.remove_circle,
                                          size: 14,
                                          color: AppColors.error,
                                        ),
                                        const SizedBox(width: AppSpacing.xs),
                                        Text(
                                          '${Helpers.formatPoints(trade.pointsSpent)} điểm',
                                          style: const TextStyle(
                                            color: AppColors.error,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: AppSpacing.sm),
                                  Text(
                                    'x${trade.quantity}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.textLight,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: AppSpacing.xs),
                              Text(
                                'Còn lại: ${Helpers.formatPoints(trade.remainPoint)} điểm',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textLight,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
