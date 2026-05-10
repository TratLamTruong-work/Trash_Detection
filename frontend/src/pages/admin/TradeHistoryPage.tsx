import { useState, useEffect } from 'react';
import { tradeHistoriesAPI, usersAPI, defaultItemsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Trash2, Plus, Eye, X } from 'lucide-react';
import type { TradeHistory, User, DefaultItem } from '../../services/types';

export default function TradeHistoryPage() {
  const { token, user } = useAuth();
  const [histories, setHistories] = useState<TradeHistory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<DefaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailView, setDetailView] = useState<TradeHistory | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedItem, setSelectedItem] = useState<DefaultItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [userSearchText, setUserSearchText] = useState('');
  const [itemSearchText, setItemSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [historiesResp, usersResp, itemsResp] = await Promise.all([
        tradeHistoriesAPI.getAll(token),
        usersAPI.getAll(token),
        defaultItemsAPI.getAll(token),
      ]);
      setHistories(historiesResp.data || []);
      setUsers(usersResp.data || []);
      setItems(itemsResp.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedUser || !selectedItem) {
      toast.error('Vui lòng chọn người dùng và vật phẩm');
      return;
    }

    if (quantity <= 0) {
      toast.error('Số lượng phải lớn hơn 0');
      return;
    }

    try {
      const payload = {
        userId: selectedUser._id,
        itemId: selectedItem._id,
        quantityTraded: quantity,
      };
      
      console.log('Sending trade history payload:', payload);
      
      await tradeHistoriesAPI.create(token, payload);
      toast.success('Tạo lịch sử giao dịch thành công!');

      // Reset form
      setSelectedUser(null);
      setSelectedItem(null);
      setQuantity(1);
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error creating trade history:', err);
      const errorMessage = err instanceof Error ? err.message : 'Lỗi tạo lịch sử giao dịch';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bạn chắc chắn muốn xóa bản ghi này?')) return;

    try {
      await tradeHistoriesAPI.delete(token, id);
      toast.success('Xóa lịch sử giao dịch thành công!');
    } catch (err) {
      toast.error('Lỗi xóa bản ghi');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lịch sử Giao dịch</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => {
              setSelectedUser(null);
              setSelectedItem(null);
              setQuantity(1);
              setUserSearchText('');
              setItemSearchText('');
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          >
            <Plus size={20} /> Thêm Giao dịch
          </button>
        )}
      </div>

      {isFormOpen && user?.role === 'ADMIN' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Tạo Giao dịch mới</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Chọn Người dùng */}
              <div>
                <label className="block text-sm font-medium mb-2">Người dùng</label>
                <button
                  type="button"
                  onClick={() => setShowUserModal(true)}
                  className="w-full text-left border border-gray-300 rounded px-4 py-2 bg-white hover:bg-gray-50 transition"
                >
                  {selectedUser ? (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{selectedUser.userName}</span>
                      <span className="text-sm text-gray-500">{selectedUser.email}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">-- Chọn người dùng --</span>
                  )}
                </button>
              </div>

              {/* Chọn Vật phẩm */}
              <div>
                <label className="block text-sm font-medium mb-2">Vật phẩm</label>
                <button
                  type="button"
                  onClick={() => setShowItemModal(true)}
                  className="w-full text-left border border-gray-300 rounded px-4 py-2 bg-white hover:bg-gray-50 transition"
                >
                  {selectedItem ? (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{selectedItem.name}</span>
                      <span className="text-sm text-gray-500">{selectedItem.pointToTrade} điểm</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">-- Chọn vật phẩm --</span>
                  )}
                </button>
              </div>

              {/* Số lượng */}
              <div>
                <label className="block text-sm font-medium mb-2">Số lượng</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  required
                  min="1"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                >
                  Tạo
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 font-medium"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chọn Người dùng */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-96 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Chọn Người dùng</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Tìm người dùng..."
              value={userSearchText}
              onChange={(e) => setUserSearchText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <div className="space-y-2">
              {users
                .filter(
                  (u) =>
                    u.userName.toLowerCase().includes(userSearchText.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearchText.toLowerCase())
                )
                .map((u) => (
                  <button
                    key={u._id}
                    onClick={() => {
                      setSelectedUser(u);
                      setShowUserModal(false);
                    }}
                    className={`w-full text-left p-3 rounded border transition ${
                      selectedUser?._id === u._id
                        ? 'bg-blue-100 border-blue-300'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{u.userName}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Chọn Vật phẩm */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-96 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Chọn Vật phẩm</h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Tìm vật phẩm..."
              value={itemSearchText}
              onChange={(e) => setItemSearchText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <div className="space-y-2">
              {items
                .filter((item) =>
                  item.name.toLowerCase().includes(itemSearchText.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      setSelectedItem(item);
                      setShowItemModal(false);
                    }}
                    className={`w-full text-left p-3 rounded border transition ${
                      selectedItem?._id === item._id
                        ? 'bg-blue-100 border-blue-300'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.pointToTrade} điểm</div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {detailView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Chi tiết Giao dịch</h2>
            <div className="space-y-2 mb-6">
              <p>
                <strong>Người dùng:</strong> {detailView.user?.username || detailView.userId || '-'}
              </p>
              <p>
                <strong>Email:</strong> {detailView.user?.email || '-'}
              </p>
              <p>
                <strong>Vật phẩm:</strong> {detailView.item?.name || detailView.itemId || '-'}
              </p>
              <p>
                <strong>Số lượng:</strong> {detailView.quantity || detailView.quantityTraded || '-'}
              </p>
              <p>
                <strong>Điểm trước:</strong> {detailView.previousPoint || '-'}
              </p>
              <p>
                <strong>Điểm sau:</strong> {detailView.remainedPoint || '-'}
              </p>
              <p>
                <strong>Điểm sử dụng:</strong> {detailView.previousPoint && detailView.remainedPoint ? (detailView.previousPoint - detailView.remainedPoint) : detailView.pointsUsed || '-'}
              </p>
              <p>
                <strong>Trạng thái:</strong> {detailView.status || 'completed'}
              </p>
              <p>
                <strong>Ghi chú:</strong> {detailView.notes || '-'}
              </p>
              <p>
                <strong>Ngày tạo:</strong> {new Date(detailView.createdAt).toLocaleString('vi-VN')}
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
                <th className="px-4 py-3 text-left">Điểm sử dụng</th>
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
                  <td className="px-4 py-3 text-sm">{history.user?.username || history.userId || '-'}</td>
                  <td className="px-4 py-3 text-sm">{history.item?.name || history.itemId || '-'}</td>
                  <td className="px-4 py-3 text-sm">{history.quantity || history.quantityTraded || '-'}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{history.previousPoint && history.remainedPoint ? (history.previousPoint - history.remainedPoint) : history.pointsUsed || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      history.status === 'completed' ? 'bg-green-100 text-green-800' :
                      history.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {history.status || 'completed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(history.createdAt).toLocaleDateString()}</td>
                  {user?.role === 'ADMIN' && (
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => setDetailView(history)}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye size={16} />
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
