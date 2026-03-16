import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { Toast } from './Toast';
import { ThemeToggle } from './ThemeToggle';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning'; key: number } | null>(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type, key: Date.now() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      showToast('Harap isi username dan password', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      await login(username, password);

      showToast('Login berhasil!', 'success');

      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login gagal', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat relative flex items-center justify-center"
      style={{ backgroundImage: "url('/TPS2.jpg')" }}
    >
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">TPS Attendance</h1>
        </div>

        {/* Login Card */}
        <div className="
          bg-background/60!
          backdrop-blur-sm!
          border-2 border-white/20 dark:border-white/10
          text-card-foreground rounded-lg shadow-xl p-6 sm:p-8 lg:p-10
        ">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1 sm:mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background/40 text-foreground placeholder:text-foreground/50 min-h-12 sm:min-h-11"
                placeholder="Masukkan username"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1 sm:mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 sm:px-3 sm:py-2 text-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background/40 text-foreground placeholder:text-foreground/50 min-h-12 sm:min-h-11"
                placeholder="Masukkan password"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                relative w-full text-base font-bold py-2 px-7 rounded-2xl
                transition-all duration-150 ease-in-out
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
                bg-linear-to-br from-blue-500 via-blue-600 to-blue-700 text-foreground
                shadow-[0_8px_0_0,0_12px_0_0,0_16px_0_rgba(0,0,0,0.1)]
                hover:shadow-[0_12px_0_0,0_16px_0_0,0_20px_0_rgba(0,0,0,0.15)]
                active:shadow-[0_2px_0_0,0_4px_0_0,0_6px_0_rgba(0,0,0,0.1)]
                active:translate-y-1.5
                border-t-2 border-blue-400
              `}
              style={{
                boxShadow: '0 8px 0 0 #1d4ed8, 0 12px 0 0 #1e40af, 0 16px 8px rgba(0,0,0,0.2)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Loading...' : 'Login'}
              </span>
            </button>
          </form>
        </div>


        {/* Toast */}
        {toast && <Toast key={toast.key} message={toast.message} type={toast.type} />}
        </div>
      </div>
    </div>
  );
}
