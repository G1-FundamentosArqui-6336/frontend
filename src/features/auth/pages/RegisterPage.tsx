import RegisterForm from "../components/RegisterForm";
import { useRegister } from "../hooks/useRegister";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const mutation = useRegister();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/cobox-auth-bg.png')" }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative w-full max-w-lg px-4 py-8 sm:px-6 sm:py-10 z-10">
        <RegisterForm onSubmit={(data) => mutation.mutate(data)} />

        {mutation.isSuccess && (
          <div className="mt-4 text-green-700 bg-green-100/90 p-3 rounded-lg">
            Registrado correctamente.{" "}
            <button
              className="text-blue-600 underline hover:text-blue-700"
              onClick={() => navigate("/login")}
              type="button"
            >
              Ir a login
            </button>
          </div>
        )}

        {mutation.isError && (
          <p className="mt-3 text-red-600 bg-red-100/90 p-3 rounded-lg">
            Error al registrar: {String(mutation.error?.message)}
          </p>
        )}

        <p className="text-center mt-4 text-sm text-white">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-300 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
