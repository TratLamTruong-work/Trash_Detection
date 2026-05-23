import { useState, useEffect } from 'react';
import { pointTransactionAPI } from '../../services/pointTransactionService';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Eye, Trash2 } from 'lucide-react';
import type { PointTransaction, User } from '../../services/types';

export default function PointTransactionPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailView, setDetailView] = useState<PointTransaction | null>(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  const getUserDisplayName = (userId: string | User) => {
    if (typeof userId === 'object') {
      return userId.userName;
    }

    return users.find((user) => user._id === userId)?.userName ?? userId;
  };

  const fetchData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [txResp, usersResp] = await Promise.all([
        pointTransactionAPI.getAll(token),
        usersAPI.getAll(token),
      ]);
      setTransactions(txResp.data || []);
      setUsers(usersResp.data || []);
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !window.confirm('Bạn chắc chắn muốn xóa giao dịch này?')) return;
    try {
      await pointTransactionAPI.delete(token, id);
      toast.success('Xóa giao dịch thành công!');
      fetchData();
    } catch {
      toast.error('Lỗi xóa giao dịch');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý Điểm</h1>
      {isLoading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Người dùng</th>
                <th className="px-4 py-2">Loại</th>
                <th className="px-4 py-2">Phương thức</th>
                <th className="px-4 py-2">Điểm</th>
                <th className="px-4 py-2">Trước</th>
                <th className="px-4 py-2">Sau</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Thời gian</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-t">
                  <td className="px-4 py-2">{getUserDisplayName(tx.userId)}</td>
                  <td className="px-4 py-2">{tx.type}</td>
                  <td className="px-4 py-2">{tx.method}</td>
                  <td className="px-4 py-2">{tx.points}</td>
                  <td className="px-4 py-2">{tx.prevPoint}</td>
                  <td className="px-4 py-2">{tx.currentPoint}</td>
                  <td className="px-4 py-2">{tx.status}</td>
                  <td className="px-4 py-2">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => setDetailView(tx)} className="text-blue-600 hover:underline" title="Xem chi tiết">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDelete(tx._id)} className="text-red-600 hover:underline" title="Xóa">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Chi tiết giao dịch */}
      {detailView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setDetailView(null)}
            >
              Đóng
            </button>
            <h2 className="text-xl font-bold mb-4">Chi tiết Point Transaction</h2>
            <div className="space-y-2">
              <div><b>Người dùng:</b> {getUserDisplayName(detailView.userId)}</div>
              <div><b>Loại:</b> {detailView.type}</div>
              <div><b>Phương thức:</b> {detailView.method}</div>
              <div><b>Điểm:</b> {detailView.points}</div>
              <div><b>Trước:</b> {detailView.prevPoint}</div>
              <div><b>Sau:</b> {detailView.currentPoint}</div>
              <div><b>Trạng thái:</b> {detailView.status}</div>
              <div><b>Thời gian:</b> {new Date(detailView.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
