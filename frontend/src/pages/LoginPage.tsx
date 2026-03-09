import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign In Form
  const [signInData, setSignInData] = useState({
    userName: '',
    password: '',
  });

  // Sign Up Form
  const [signUpData, setSignUpData] = useState({
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    male: true,
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.signIn(signInData.userName, signInData.password);
      
      if (!response.success) {
        setError(response.message);
        toast.error(response.message);
        return;
      }

      const { accessToken, user } = response.data;
      setToken(accessToken);
      setUser(user);
      toast.success('Đăng nhập thành công!');
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/default-items');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi đăng nhập';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.signUp(signUpData);
      
      if (!response.success) {
        setError(response.message);
        toast.error(response.message);
        return;
      }

      const { accessToken, user } = response.data;
      setToken(accessToken);
      setUser(user);
      toast.success('Đăng ký thành công!');
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi đăng ký';
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

        {!isSignUp ? (
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
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
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
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
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

            <p className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 hover:underline font-semibold"
              >
                Đăng ký
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3">
            <h2 className="text-xl font-semibold text-center mb-6">Đăng ký</h2>

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
                value={signUpData.userName}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, userName: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  value={signUpData.firstName}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, firstName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  value={signUpData.lastName}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, lastName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                value={signUpData.birthDate}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, birthDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
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
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={signUpData.male}
                    onChange={() => setSignUpData({ ...signUpData, male: true })}
                    disabled={isLoading}
                    className="mr-2"
                  />
                  Nam
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!signUpData.male}
                    onChange={() => setSignUpData({ ...signUpData, male: false })}
                    disabled={isLoading}
                    className="mr-2"
                  />
                  Nữ
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-blue-600 hover:underline font-semibold"
              >
                Đăng nhập
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
