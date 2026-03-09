import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Trash2, Edit2, Shield, User } from 'lucide-react';

interface UserManagementUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  male: boolean;
  role: 'ADMIN' | 'USER';
  totalPoint: number;
  birthDate?: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserManagementUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<UserManagementUser | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    male: true,
    role: 'USER' as 'ADMIN' | 'USER',
    totalPoint: 0,
    birthDate: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const response = await usersAPI.getAll(token);
      setUsers(response.data || response.data);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (userData: UserManagementUser) => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      male: userData.male,
      role: userData.role,
      totalPoint: userData.totalPoint,
      birthDate: userData.birthDate || '',
    });
    setEditingId(userData._id);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await usersAPI.update(token, editingId!, formData);
      toast.success('Cập nhật người dùng thành công!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        male: true,
        role: 'USER',
        totalPoint: 0,
        birthDate: '',
      });
      setEditingId(null);
      setIsFormOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error('Lỗi cập nhật người dùng');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bạn chắc chắn muốn xóa người dùng này?')) return;

    try {
      await usersAPI.delete(token, id);
      toast.success('Xóa người dùng thành công!');
      fetchUsers();
    } catch (err) {
      toast.error('Lỗi xóa người dùng');
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'ADMIN'
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
      </div>

      {isFormOpen && editingId && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Chỉnh sửa Người dùng</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên đệm
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Họ</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giới tính</label>
                <select
                  value={formData.male ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({ ...formData, male: e.target.value === 'true' })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Vai trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'ADMIN' | 'USER',
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tổng điểm
                </label>
                <input
                  type="number"
                  value={formData.totalPoint}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalPoint: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Cập nhật
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
            <h2 className="text-2xl font-bold mb-4">Chi tiết Người dùng</h2>
            <div className="space-y-2 mb-6">
              <p>
                <strong>Tên:</strong> {detailView.firstName} {detailView.lastName}
              </p>
              <p>
                <strong>Tên đăng nhập:</strong> {detailView.userName}
              </p>
              <p>
                <strong>Email:</strong> {detailView.email}
              </p>
              <p>
                <strong>Giới tính:</strong> {detailView.male ? 'Nam' : 'Nữ'}
              </p>
              <p>
                <strong>Ngày sinh:</strong>{' '}
                {detailView.birthDate
                  ? new Date(detailView.birthDate).toLocaleDateString('vi-VN')
                  : '-'}
              </p>
              <p>
                <strong>Tổng điểm:</strong>{' '}
                <span className="font-bold text-blue-600">{detailView.totalPoint}</span>
              </p>
              <p>
                <strong>Vai trò:</strong>{' '}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getRoleColor(
                    detailView.role
                  )}`}
                >
                  {detailView.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                <strong>Ngày tạo:</strong>{' '}
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
                <th className="px-4 py-3 text-left">Tên đăng nhập</th>
                <th className="px-4 py-3 text-left">Họ tên</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Điểm</th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData) => (
                <tr
                  key={userData._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm">{userData.userName}</td>
                  <td className="px-4 py-3 text-sm">
                    {userData.firstName} {userData.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {userData.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${getRoleColor(
                        userData.role
                      )}`}
                    >
                      {userData.role === 'ADMIN' ? (
                        <>
                          <Shield size={14} />{' '}
                          <span>Quản trị viên</span>
                        </>
                      ) : (
                        <>
                          <User size={14} />
                          <span>Người dùng</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                    {userData.totalPoint}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setDetailView(userData)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Xem chi tiết"
                    >
                      {' '}
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleEdit(userData)}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      title="Sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(userData._id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Không có người dùng nào
        </div>
      )}
    </div>
  );
}
