import LoginForm from '../components/LoginForm';
import { useAuth } from '@/app/providers/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleSubmit(email: string, password: string) {
    try {
      await auth.login(email, password);
      navigate('/');
    } catch (e) {
      // swallow here; mutation handled elsewhere if needed
      console.error('login error', e);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/login-bg.svg')" }}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative w-full max-w-md px-4 z-10">
        <LoginForm onSubmit={handleSubmit} />
        <p className="text-center mt-4 text-sm text-white">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-300 hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
