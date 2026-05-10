import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import DefaultItemsPage from './pages/admin/DefaultItemsPage';
import DashboardPage from './pages/admin/DashboardPage';
import TradeHistoryPage from './pages/admin/TradeHistoryPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="default-items" element={<DefaultItemsPage />} />
          <Route path="trade-history" element={<TradeHistoryPage />} />
          <Route path="users" element={<UserManagementPage />} />
        </Route>

        {/* Redirect root to login or admin based on auth status */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
