import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import { LoginPage } from './pages/LoginPage';
import { AttendancePage } from './pages/AttendancePage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <AttendancePage /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
