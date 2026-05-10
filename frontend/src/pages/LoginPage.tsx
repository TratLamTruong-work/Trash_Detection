import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign In Form
  const [signInData, setSignInData] = useState({
    userName: '',
    password: '',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.signIn(signInData.userName, signInData.password);
      
      if (!response.data.accessToken) {
        setError('Đăng nhập thất bại - không có token');
        toast.error('Đăng nhập thất bại - không có token');
        return;
      }

      const { accessToken, user } = response.data;
      if (!user) {
        setError('Đăng nhập thất bại - không có thông tin người dùng');
        toast.error('Đăng nhập thất bại - không có thông tin người dùng');
        return;
      }

      setToken(accessToken);
      setUser(user);
      toast.success('Đăng nhập thành công!');
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        toast.error('Người dùng không có quyền truy cập admin');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi đăng nhập';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Hệ thống Phát hiện Rác Thải
        </h1>

        <form onSubmit={handleSignIn} className="space-y-4">
          <h2 className="text-xl font-semibold text-center mb-6">Đăng nhập</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={signInData.userName}
              onChange={(e) =>
                setSignInData({ ...signInData, userName: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={signInData.password}
              onChange={(e) =>
                setSignInData({ ...signInData, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
