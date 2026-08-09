import {
  ShieldCheck,
  Users,
  KeyRound,
  Activity,
  Database,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const permissions = user.permissions || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={19} />,
      permission: null,
    },
    {
      name: "Users",
      path: "/users",
      icon: <Users size={19} />,
      permission: "user.view",
    },
    {
      name: "Roles & Permissions",
      path: "/roles",
      icon: <KeyRound size={19} />,
      permission: null,
    },
    {
      name: "Resource Access",
      path: "/resources",
      icon: <Database size={19} />,
      permission: "application.view",
    },
    {
      name: "Audit Logs",
      path: "/audit-logs",
      icon: <Activity size={19} />,
      permission: "audit.view",
    },
  ];

  const visibleMenu = menu.filter((item) => {
    if (!item.permission) {
      return true;
    }

    return permissions.includes(item.permission);
  });

  return (
    <div className="min-h-screen bg-slate-100 flex">

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

          {visibleMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

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

      <div className="flex-1">

        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

          <div>
            <p className="font-semibold text-slate-900">
              Identity & Access Management
            </p>

            <p className="text-xs text-slate-500">
              Least Privilege Security Console
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="text-right">

              <p className="text-sm font-semibold text-slate-800">
                {user.name || "User"}
              </p>

              <p className="text-xs font-medium text-indigo-600">
                {user.role || "ROLE"}
              </p>

            </div>

            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {user.name?.charAt(0) || "U"}
            </div>

          </div>

        </header>

        <main>
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;