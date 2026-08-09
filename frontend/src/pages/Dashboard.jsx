import { useEffect, useState } from "react";
import {
  Users,
  KeyRound,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";

import Layout from "../components/Layout";
import api from "../api/axios";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

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
      const [rolesResponse, auditResponse] =
        await Promise.all([
          api.get("/roles"),
          api.get("/audit-logs"),
        ]);

      const logs = auditResponse.data.logs || [];

      const allowed = logs.filter(
        (log) => log.result === "ALLOWED"
      ).length;

      const denied = logs.filter(
        (log) => log.result === "DENIED"
      ).length;

      let totalUsers = 0;

      // Only fetch users if this user has permission
      if (user.permissions?.includes("user.view")) {
        const usersResponse = await api.get("/users");

        totalUsers =
          usersResponse.data.users?.length || 0;
      }

      setStats({
        users: totalUsers,
        roles: rolesResponse.data.roles?.length || 0,
        allowed,
        denied,
      });
    } catch (error) {
      console.error(
        "Dashboard error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="p-8">

        {/* Welcome */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user.name || "User"}
          </h1>

          <p className="text-slate-500 mt-2">
            Monitor identities, roles and resource access.
          </p>

        </div>


        {/* Stats */}
        {loading ? (
          <p className="text-slate-500">
            Loading dashboard...
          </p>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            <StatCard
              icon={<Users size={21} />}
              title="Total Users"
              value={
                user.permissions?.includes("user.view")
                  ? stats.users
                  : "Restricted"
              }
              description="Registered identities"
            />

            <StatCard
              icon={<KeyRound size={21} />}
              title="IAM Roles"
              value={stats.roles}
              description="Configured roles"
            />

            <StatCard
              icon={<CheckCircle2 size={21} />}
              title="Allowed"
              value={stats.allowed}
              description="Successful access attempts"
            />

            <StatCard
              icon={<XCircle size={21} />}
              title="Denied"
              value={stats.denied}
              description="Blocked access attempts"
            />

          </div>
        )}


        {/* Current Role */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Your IAM Access
              </h2>

              <p className="text-sm text-slate-500">
                Permissions assigned to your role
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3 mb-5">

            <span className="text-sm text-slate-500">
              Current Role
            </span>

            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
              {user.role}
            </span>

          </div>


          <div className="flex flex-wrap gap-2">

            {user.permissions?.map((permission) => (

              <span
                key={permission}
                className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
              >
                {permission}
              </span>

            ))}

          </div>

        </div>


        {/* Least privilege explanation */}
        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-6">

          <h3 className="font-semibold text-indigo-900">
            Principle of Least Privilege
          </h3>

          <p className="text-sm text-indigo-700 mt-2 leading-6">
            SecureShop grants each user only the permissions
            necessary for their assigned role. Unauthorized
            resource requests are blocked and recorded in the
            audit log.
          </p>

        </div>

      </div>

    </Layout>
  );
}


function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>

      <p className="text-xs text-slate-400 mt-2">
        {description}
      </p>

    </div>
  );
}

export default Dashboard;