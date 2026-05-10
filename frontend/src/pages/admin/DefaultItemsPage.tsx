import { useState, useEffect } from 'react';
import type { DefaultItem } from '../../services/api';
import { defaultItemsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Trash2, Plus, Edit2, Eye } from 'lucide-react';

export default function DefaultItemsPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<DefaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<DefaultItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointToTrade: 0,
    image: null as File | null,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await defaultItemsAPI.getAll(token ?? '');
      setItems(response.data);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('pointToTrade', formData.pointToTrade.toString());
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingId) {
        await defaultItemsAPI.update(token, editingId, submitData);
        toast.success('Cập nhật item thành công!');
      } else {
        await defaultItemsAPI.create(token, submitData);
        toast.success('Tạo item thành công!');
      }

      setFormData({ name: '', description: '', pointToTrade: 0, image: null });
      setEditingId(null);
      setIsFormOpen(false);
      fetchItems();
    } catch (err) {
      toast.error(editingId ? 'Lỗi cập nhật item' : 'Lỗi tạo item');
    }
  };

  const handleEdit = (item: DefaultItem) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      pointToTrade: item.pointToTrade,
      image: null,
    });
    setEditingId(item._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bạn chắc chắn muốn xóa item này?')) return;

    try {
      await defaultItemsAPI.delete(token, id);
      toast.success('Xóa item thành công!');
      fetchItems();
    } catch (err) {
      toast.error('Lỗi xóa item');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
  };

  const handleViewDetail = async (id: string) => {
    if (!token) return;
    try {
      const response = await defaultItemsAPI.getById(token, id);
      setDetailView(response.data);
    } catch (err) {
      toast.error('Lỗi khi tải chi tiết item');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản Lý Phần Thưởng</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => {
              setFormData({ name: '', description: '', pointToTrade: 0, image: null });
              setEditingId(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          >
            <Plus size={20} /> Thêm Item
          </button>
        )}
      </div>

      {isFormOpen && user?.role === 'ADMIN' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Chỉnh sửa Item' : 'Tạo Item mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên Item</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Điểm để trade
              </label>
              <input
                type="number"
                value={formData.pointToTrade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pointToTrade: parseInt(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2"
                required={!editingId}
              />
              {editingId && (
                <p className="text-sm text-gray-500 mt-1">
                  Để trống nếu không muốn thay đổi hình ảnh
                </p>
              )}
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
            <h2 className="text-2xl font-bold mb-4">{detailView.name}</h2>
            <img
              src={detailView.imageUrl}
              alt={detailView.name}
              className="w-full h-64 object-cover rounded mb-4"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
            <div className="space-y-2 mb-6">
              <p>
                <strong>Mô tả:</strong> {detailView.description}
              </p>
              <p>
                <strong>Điểm để trade:</strong>{' '}
                <span className="font-bold text-blue-600">
                  {detailView.pointToTrade}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                <strong>Ngày tạo:</strong>{' '}
                {detailView.createdAt ? new Date(detailView.createdAt).toLocaleString('vi-VN') : '-'}
              </p>
            </div>
            <button
              onClick={() => setDetailView(null)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover rounded mb-3"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-3">
                Điểm: <span className="font-bold">{item.pointToTrade}</span>
              </p>

              {user?.role === 'ADMIN' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetail(item._id)}
                    className="flex-1 bg-gray-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-600"
                  >
                    <Eye size={16} /> Xem
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-600"
                  >
                    <Edit2 size={16} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-600"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Không có items nào
        </div>
      )}
    </div>
  );
}
