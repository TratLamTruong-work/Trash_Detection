import { useState, useEffect } from 'react';
import type { DefaultItem } from '../../services/api';
import { defaultItemsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function DefaultItemsPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<DefaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    pointToTrade: 0,
    imageUrl: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await defaultItemsAPI.getAll();
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
      if (editingId) {
        await defaultItemsAPI.update(token, editingId, formData);
        toast.success('Cập nhật item thành công!');
      } else {
        await defaultItemsAPI.create(token, formData);
        toast.success('Tạo item thành công!');
      }
      
      setFormData({ name: '', pointToTrade: 0, imageUrl: '' });
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
      pointToTrade: item.pointToTrade,
      imageUrl: item.imageUrl,
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Default Items</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              setFormData({ name: '', pointToTrade: 0, imageUrl: '' });
              setEditingId(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          >
            <Plus size={20} /> Thêm Item
          </button>
        )}
      </div>

      {isFormOpen && user?.role === 'admin' && (
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
              <label className="block text-sm font-medium mb-1">URL Hình ảnh</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
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

              {user?.role === 'admin' && (
                <div className="flex gap-2">
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
