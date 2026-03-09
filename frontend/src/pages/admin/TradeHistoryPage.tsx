import { useState, useEffect } from 'react';
import type { TradeHistory } from '../../services/api';
import { tradeHistoriesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Trash2, Plus, Eye } from 'lucide-react';

export default function TradeHistoryPage() {
  const { token, user } = useAuth();
  const [histories, setHistories] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<TradeHistory | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    itemId: '',
    quantityTraded: 0,
    pointsUsed: 0,
    status: 'completed',
    notes: '',
  });

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    if (!token) return;
    try {
      const response = await tradeHistoriesAPI.getAll(token);
      setHistories(response.data);
    } catch (err) {
      toast.error('Lỗi khi tải lịch sử giao dịch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingId) {
        await tradeHistoriesAPI.update(token, editingId, formData);
        toast.success('Cập nhật lịch sử thành công!');
      } else {
        await tradeHistoriesAPI.create(token, formData);
        toast.success('Tạo lịch sử thành công!');
      }

      setFormData({
        userId: '',
        itemId: '',
        quantityTraded: 0,
        pointsUsed: 0,
        status: 'completed',
        notes: '',
      });
      setEditingId(null);
      setIsFormOpen(false);
      fetchHistories();
    } catch (err) {
      toast.error(editingId ? 'Lỗi cập nhật' : 'Lỗi tạo');
    }
  };

  const handleEdit = (history: TradeHistory) => {
    setFormData({
      userId: history.userId,
      itemId: history.itemId,
      quantityTraded: history.quantityTraded || 0,
      pointsUsed: history.pointsUsed || 0,
      status: history.status || 'completed',
      notes: history.notes || '',
    });
    setEditingId(history._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bạn chắc chắn muốn xóa bản ghi này?')) return;

    try {
      await tradeHistoriesAPI.delete(token, id);
      toast.success('Xóa lịch sử thành công!');
      fetchHistories();
    } catch (err) {
      toast.error('Lỗi xóa bản ghi');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lịch sử Giao dịch</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => {
              setFormData({
                userId: '',
                itemId: '',
                quantityTraded: 0,
                pointsUsed: 0,
                status: 'completed',
                notes: '',
              });
              setEditingId(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          >
            <Plus size={20} /> Thêm Bản ghi
          </button>
        )}
      </div>

      {isFormOpen && user?.role === 'ADMIN' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Chỉnh sửa Lịch sử' : 'Tạo Lịch sử mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">User ID</label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Item ID</label>
                <input
                  type="text"
                  value={formData.itemId}
                  onChange={(e) =>
                    setFormData({ ...formData, itemId: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số lượng
                </label>
                <input
                  type="number"
                  value={formData.quantityTraded}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantityTraded: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Điểm sử dụng
                </label>
                <input
                  type="number"
                  value={formData.pointsUsed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pointsUsed: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="pending">Đang chờ</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Hủy bỏ</option>
                  <option value="failed">Thất bại</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ghi chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingId ? 'Cập nhật' : 'Tạo'}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {detailView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Chi tiết Giao dịch</h2>
            <div className="space-y-2 mb-6">
              <p>
                <strong>User ID:</strong> {detailView.userId}
              </p>
              <p>
                <strong>Item ID:</strong> {detailView.itemId}
              </p>
              <p>
                <strong>Số lượng:</strong> {detailView.quantityTraded}
              </p>
              <p>
                <strong>Điểm sử dụng:</strong> {detailView.pointsUsed}
              </p>
              <p>
                <strong>Trạng thái:</strong>{' '}
                <span className={`px-2 py-1 rounded ${getStatusColor(detailView.status || 'pending')}`}>
                  {detailView.status || 'pending'}
                </span>
              </p>
              <p>
                <strong>Ghi chú:</strong> {detailView.notes || '-'}
              </p>
              <p className="text-xs text-gray-500">
                <strong>Ngày:</strong>{' '}
                {new Date(detailView.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
            <button
              onClick={() => setDetailView(null)}
              className="w-full bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left">User ID</th>
                <th className="px-4 py-3 text-left">Item ID</th>
                <th className="px-4 py-3 text-left">Số lượng</th>
                <th className="px-4 py-3 text-left">Điểm</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Ngày</th>
                {user?.role === 'ADMIN' && <th className="px-4 py-3 text-left">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {histories.map((history) => (
                <tr
                  key={history._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm">{history.userId}</td>
                  <td className="px-4 py-3 text-sm">{history.itemId}</td>
                  <td className="px-4 py-3 text-sm">{history.quantityTraded}</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    {history.pointsUsed}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                        history.status || 'pending'
                      )}`}
                    >
                      {history.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(history.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => setDetailView(history)}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(history)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(history._id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && histories.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Không có lịch sử giao dịch nào
        </div>
      )}
    </div>
  );
}
