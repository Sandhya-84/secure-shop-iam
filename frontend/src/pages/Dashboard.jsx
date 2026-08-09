import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  KeyRound,
  Activity,
  Database,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    allowed: 0,
    denied: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersResponse, rolesResponse, auditResponse] =
        await Promise.all([
          api.get("/users"),
          api.get("/roles"),
          api.get("/audit-logs"),
        ]);

      const logs = auditResponse.data.logs || [];

      const allowedCount = logs.filter(
        (log) => log.result === "ALLOWED"
      ).length;

      const deniedCount = logs.filter(
        (log) => log.result === "DENIED"
      ).length;

      setStats({
        users: usersResponse.data.users?.length || 0,
        roles: rolesResponse.data.roles?.length || 0,
        allowed: allowedCount,
        denied: deniedCount,
      });
    } catch (error) {
      console.error(
        "Dashboard data error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-white min-h-screen flex flex-col">

        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>

          <div className="ml-3">
            <h1 className="font-bold">
              SecureShop
            </h1>

            <p className="text-xs text-slate-400">
              IAM Console
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600">
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white">
            <Users size={19} />
            Users
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white">
            <KeyRound size={19} />
            Roles & Permissions
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white">
            <Database size={19} />
            Resource Access
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white">
            <Activity size={19} />
            Audit Logs
          </button>

        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>

      </aside>


      {/* MAIN */}
      <main className="flex-1">

        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              IAM Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Security and access overview
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {user.name || "User"}
              </p>

              <p className="text-xs text-indigo-600 font-medium">
                {user.role || "ROLE"}
              </p>
            </div>

            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
              {user.name?.charAt(0) || "U"}
            </div>

          </div>

        </header>

        <div className="p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome, {user.name || "User"}
            </h1>

            <p className="text-slate-500 mt-2">
              Monitor identities, roles and resource access.
            </p>
          </div>


          {loading ? (
            <p className="text-slate-500">
              Loading dashboard...
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

              <StatCard
                icon={<Users />}
                title="Total Users"
                value={stats.users}
                description="Registered identities"
              />

              <StatCard
                icon={<KeyRound />}
                title="IAM Roles"
                value={stats.roles}
                description="Configured roles"
              />

              <StatCard
                icon={<CheckCircle2 />}
                title="Allowed"
                value={stats.allowed}
                description="Successful access attempts"
              />

              <StatCard
                icon={<XCircle />}
                title="Denied"
                value={stats.denied}
                description="Blocked access attempts"
              />

            </div>
          )}

          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Least Privilege IAM
                </h3>

                <p className="text-sm text-slate-500">
                  Access control status
                </p>
              </div>

            </div>

            <p className="text-sm text-slate-600 leading-6">
              SecureShop uses role-based access control to ensure
              that every identity receives only the permissions
              required for its assigned responsibilities.
            </p>

          </div>

        </div>

      </main>
    </div>
  );
}


function StatCard({ icon, title, value, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-3xl font-bold text-slate-900 mt-1">
        {value}
      </p>

      <p className="text-xs text-slate-400 mt-2">
        {description}
      </p>

    </div>
  );
}

export default Dashboard;