import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Trash2, Edit2, Eye, Plus } from 'lucide-react';

interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  male: boolean;
  points: number;
  iconUrl: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
}

export default function UserManagementPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    male: true,
    points: 0,
    role: 'USER' as 'ADMIN' | 'USER',
    icon: null as File | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const response = await usersAPI.getAll(token);
        setUsers(response.data);
      } catch {
        toast.error('Lỗi khi tải danh sách người dùng');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await usersAPI.getAll(token);
      setUsers(response.data);
    } catch {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      userName: '',
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      male: user.male,
      points: user.points,
      role: user.role,
      icon: null,
    });
    setEditingId(user._id);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingId) {
        const updateData = new FormData();
        updateData.append('firstName', formData.firstName);
        updateData.append('lastName', formData.lastName);
        updateData.append('email', formData.email);
        updateData.append('birthDate', formData.birthDate);
        updateData.append('male', formData.male.toString());
        updateData.append('point', formData.points.toString());
        updateData.append('role', formData.role);

        if (formData.icon) {
          updateData.append('image', formData.icon);
        }

        await usersAPI.update(token, editingId, updateData);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        if (!formData.userName || !formData.password) {
          toast.error('Tên đăng nhập và mật khẩu bắt buộc');
          return;
        }

        const createData = new FormData();
        createData.append('userName', formData.userName);
        createData.append('password', formData.password);
        createData.append('firstName', formData.firstName);
        createData.append('lastName', formData.lastName);
        createData.append('email', formData.email);
        createData.append('birthDate', formData.birthDate);
        createData.append('male', formData.male.toString());
        createData.append('point', formData.points.toString());
        createData.append('role', formData.role);
        if (formData.icon) {
          createData.append('image', formData.icon);
        }

        await usersAPI.create(token, createData);
        toast.success('Tạo người dùng mới thành công!');
      }

      setFormData({
        userName: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        male: true,
        points: 0,
        role: 'USER',
        icon: null,
      });
      setEditingId(null);
      setIsFormOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? 'Lỗi cập nhật người dùng' : 'Lỗi thêm người dùng');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bạn chắc chắn muốn xóa người dùng này?')) return;

    try {
      await usersAPI.delete(token, id);
      toast.success('Xóa người dùng thành công!');
      fetchUsers();
    } catch {
      toast.error('Lỗi xóa người dùng');
    }
  };

  const handleViewDetail = async (id: string) => {
    if (!token) return;
    try {
      const response = await usersAPI.getById(token, id);
      setDetailView(response.data);
    } catch {
      toast.error('Lỗi khi tải chi tiết người dùng');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, icon: file });
  };

  if (isLoading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
        <button
          onClick={() => {
            setFormData({
              userName: '',
              password: '',
              firstName: '',
              lastName: '',
              email: '',
              birthDate: '',
              male: true,
              points: 0,
              role: 'USER',
              icon: null,
            });
            setEditingId(null);
            setIsFormOpen(!isFormOpen);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Plus size={20} /> {isFormOpen ? 'Đóng Form' : 'Thêm người dùng'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? 'Chỉnh sửa Người dùng' : 'Thêm người dùng mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
{!editingId && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Tên đăng nhập</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Mật khẩu</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Họ</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Tên</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Điểm</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'ADMIN' | 'USER',
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Giới tính</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.male}
                    onChange={() => setFormData({ ...formData, male: true })}
                    className="mr-2 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Nam</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.male}
                    onChange={() => setFormData({ ...formData, male: false })}
                    className="mr-2 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Nữ</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Ảnh đại diện (không bắt buộc)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium"
              >
                {editingId ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition font-medium"
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      )}

      {detailView && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Chi tiết Người dùng</h2>
            <div className="space-y-2 mb-6">
              {detailView.iconUrl && (
                <img
                  src={detailView.iconUrl}
                  alt={detailView.userName}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <p>
                <strong>Tên đăng nhập:</strong> {detailView.userName}
              </p>
              <p>
                <strong>Họ tên:</strong> {detailView.firstName}{' '}
                {detailView.lastName}
              </p>
              <p>
                <strong>Email:</strong> {detailView.email}
              </p>
              <p>
                <strong>Ngày sinh:</strong> {detailView.birthDate}
              </p>
              <p>
                <strong>Giới tính:</strong> {detailView.male ? 'Nam' : 'Nữ'}
              </p>
              <p>
                <strong>Điểm:</strong> {detailView.points}
              </p>
              <p>
                <strong>Vai trò:</strong> {detailView.role}
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Tên đăng nhập</th>
              <th className="px-4 py-3 text-left">Họ tên</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Ngày sinh</th>
              <th className="px-4 py-3 text-left">Điểm</th>
              <th className="px-4 py-3 text-left">Vai trò</th>
              <th className="px-4 py-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{user.userName}</td>
                <td className="px-4 py-3">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.birthDate || '-'}</td>
                <td className="px-4 py-3">{user.points}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'ADMIN'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleViewDetail(user._id)}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-yellow-500 hover:text-yellow-700 flex items-center gap-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
