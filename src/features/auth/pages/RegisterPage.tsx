import RegisterForm from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const mutation = useRegister();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg px-4">
        <RegisterForm onSubmit={(data) => mutation.mutate(data)} />

        {mutation.isSuccess && (
          <div className="mt-4 text-green-700">Registrado correctamente. <button className="text-blue-600 underline" onClick={() => navigate('/login')}>Ir a login</button></div>
        )}
        {mutation.isError && <p className="mt-3 text-red-600">Error al registrar: {String(mutation.error?.message)}</p>}

        <p className="text-center mt-4 text-sm">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
