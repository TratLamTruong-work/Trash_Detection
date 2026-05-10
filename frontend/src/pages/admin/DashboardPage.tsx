import { useEffect, useMemo, useState } from 'react';
import { defaultItemsAPI, tradeHistoriesAPI, usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { DefaultItem, TradeHistory, User } from '../../services/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<DefaultItem[]>([]);
  const [histories, setHistories] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const [usersResp, itemsResp, historiesResp] = await Promise.all([
          usersAPI.getAll(token),
          defaultItemsAPI.getAll(token),
          tradeHistoriesAPI.getAll(token),
        ]);

        setUsers(usersResp.data);
        setItems(itemsResp.data);
        setHistories(historiesResp.data);
      } catch (err) {
        toast.error('Không thể tải số liệu dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const totalPointsUsed = useMemo(
    () => histories.reduce((sum, history) => {
      const pointsUsed = history.previousPoint && history.remainedPoint 
        ? history.previousPoint - history.remainedPoint 
        : (history.pointsUsed || 0);
      return sum + pointsUsed;
    }, 0),
    [histories],
  );

  const recentTrades = useMemo(
    () => [...histories].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [histories],
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">Tổng quan hoạt động hệ thống và số liệu chính.</p>
      </div>

      {isLoading ? (
        <div className="rounded-lg bg-white p-8 shadow-sm text-center text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Người dùng</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{users.length}</p>
              <p className="text-sm text-gray-500 mt-2">Tổng số người dùng đang đăng ký</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Vật phẩm</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{items.length}</p>
              <p className="text-sm text-gray-500 mt-2">Tổng số vật phẩm hiện có</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Giao dịch</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{histories.length}</p>
              <p className="text-sm text-gray-500 mt-2">Tổng số giao dịch đã thực hiện</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Điểm đã dùng</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{totalPointsUsed}</p>
              <p className="text-sm text-gray-500 mt-2">Tổng điểm đã đổi trong giao dịch</p>
            </div>
          </div>

          <div className="mb-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Giao dịch gần nhất</h2>
              {recentTrades.length === 0 ? (
                <p className="text-gray-500">Chưa có giao dịch nào.</p>
              ) : (
                <div className="space-y-3">
                  {recentTrades.map((history) => (
                    <div key={history._id} className="rounded-lg border border-gray-100 p-4 hover:bg-blue-50 transition bg-gray-50">
                      {/* Row 1: User Info */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{history.user?.username || history.userId || '-'}</p>
                          <p className="text-xs text-gray-500">{history.user?.email || '-'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{new Date(history.createdAt).toLocaleDateString('vi-VN')}</p>
                          <p className="text-xs text-gray-500">{new Date(history.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      
                      {/* Row 2: Trade Details */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white rounded p-2 border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Vật phẩm</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">{history.item?.name || history.itemId || '-'}</p>
                        </div>
                        <div className="bg-white rounded p-2 border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">SL</p>
                          <p className="text-sm font-semibold text-blue-600">{history.quantity || history.quantityTraded || '-'}</p>
                        </div>
                        <div className="bg-white rounded p-2 border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Điểm dùng</p>
                          <p className="text-sm font-semibold text-green-600">{history.previousPoint && history.remainedPoint ? (history.previousPoint - history.remainedPoint) : history.pointsUsed || '-'}</p>
                        </div>
                        <div className="bg-white rounded p-2 border border-gray-200">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Còn lại</p>
                          <p className="text-sm font-semibold text-orange-600">{history.remainedPoint || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
