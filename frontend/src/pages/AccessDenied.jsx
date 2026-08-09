import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AccessDenied() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">

        <div className="w-16 h-16 mx-auto bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
          <ShieldX size={32} />
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Access Denied
        </h1>

        <p className="text-slate-500 mt-3">
          Your IAM role does not have permission to access this resource.
        </p>

        <div className="mt-6 bg-slate-50 rounded-xl p-4">

          <p className="text-xs text-slate-400">
            Current Role
          </p>

          <p className="font-semibold text-indigo-600 mt-1">
            {user.role || "UNKNOWN"}
          </p>

        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium"
        >
          Return to Dashboard
        </button>

      </div>

    </div>
  );
}

export default AccessDenied;