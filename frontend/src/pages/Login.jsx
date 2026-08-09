import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LockKeyhole } from "lucide-react";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">

        <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl top-20 left-20" />
        <div className="absolute w-80 h-80 bg-violet-600/20 rounded-full blur-3xl bottom-10 right-10" />

        <div className="relative z-10 max-w-lg px-12">

          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl flex items-center justify-center mb-8">
            <ShieldCheck
              size={30}
              className="text-indigo-400"
            />
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight">
            Secure access.
            <br />
            <span className="text-indigo-400">
              Minimum privilege.
            </span>
          </h1>

          <p className="text-slate-400 mt-6 text-lg leading-8">
            Role-based identity and access management
            designed to protect SecureShop resources
            using the principle of least privilege.
          </p>

          <div className="flex gap-6 mt-10 text-sm text-slate-400">

            <span>RBAC</span>
            <span>•</span>
            <span>JWT Authentication</span>
            <span>•</span>
            <span>Audit Logs</span>

          </div>

        </div>
      </div>


      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center px-6">

        <div className="w-full max-w-md">

          <div className="mb-9">

            <div className="flex items-center gap-3 mb-7 lg:hidden">

              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheck
                  size={22}
                  className="text-white"
                />
              </div>

              <span className="font-bold text-slate-900">
                SecureShop IAM
              </span>

            </div>

            <p className="text-sm font-semibold text-indigo-600 mb-2">
              SECURESHOP IAM
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="text-slate-500 mt-2">
              Sign in to access your security dashboard.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@secureshop.com"
                required
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none transition
                           focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute right-4 top-4 text-slate-400"
                />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none transition
                             focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3.5 rounded-xl transition"
            >
              Sign in securely
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />

              <span>
                Protected by SecureShop Identity & Access Management
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;