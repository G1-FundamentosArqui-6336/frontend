import { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useAuth } from "@/app/providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { setPageTitle } from "@/core/utils/page-title";

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    setPageTitle("Sign In");
  }, []);

  async function handleSubmit(email: string, password: string) {
    try {
      await auth.login(email, password);
      navigate("/");
    } catch (e) {
      console.error("login error", e);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/cobox-auth-bg.png')" }}
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full min-h-screen overflow-y-auto flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <LoginForm onSubmit={handleSubmit} />
          <p className="text-center mt-4 text-sm text-white">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-300 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
