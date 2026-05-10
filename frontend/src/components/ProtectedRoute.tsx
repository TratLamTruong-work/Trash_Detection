import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER' | 'ALL';
}

export default function ProtectedRoute({
  children,
  requiredRole = 'ALL',
}: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Nếu chưa đăng nhập
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu cần quyền ADMIN nhưng người dùng không phải ADMIN
  if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
