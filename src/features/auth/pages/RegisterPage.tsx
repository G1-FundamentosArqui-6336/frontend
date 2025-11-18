import { useEffect } from "react";
import RegisterForm from "../components/RegisterForm";
import { useRegister } from "../hooks/useRegister";
import { useNavigate, Link } from "react-router-dom";
import { setPageTitle } from "@/core/utils/page-title";

export default function RegisterPage() {
  const mutation = useRegister();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Register");
  }, []);

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
            Registered successfully.{" "}
            <button
              className="text-blue-600 underline hover:text-blue-700"
              onClick={() => navigate("/login")}
              type="button"
            >
              Go to login
            </button>
          </div>
        )}

        {mutation.isError && (
          <p className="mt-3 text-red-600 bg-red-100/90 p-3 rounded-lg">
            Registration error: {String(mutation.error?.message)}
          </p>
        )}

        <p className="text-center mt-4 text-sm text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
