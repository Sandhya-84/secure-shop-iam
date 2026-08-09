import { useState } from "react";
import {
  Server,
  Database,
  Rocket,
  Eye,
  Pencil,
  Archive,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Layout from "../components/Layout";
import api from "../api/axios";

function Resources() {
  const [message, setMessage] = useState(null);
  const [loadingAction, setLoadingAction] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const permissions = user.permissions || [];

  const runAction = async (label, method, url) => {
    try {
      setLoadingAction(label);
      setMessage(null);

      const response = await api({
        method,
        url,
      });

      setMessage({
        type: "success",
        title: "Access Granted",
        text:
          response.data.message ||
          `${label} completed successfully`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        title: "Access Denied",
        text:
          error.response?.data?.message ||
          "You do not have permission to perform this action",
        permission:
          error.response?.data?.requiredPermission,
      });
    } finally {
      setLoadingAction("");
    }
  };

  const actions = [
    {
      title: "View Application",
      description:
        "View SecureShop application information and status.",
      icon: <Eye size={22} />,
      method: "GET",
      url: "/resources/application",
      permission: "application.view",
    },

    {
      title: "Deploy Application",
      description:
        "Deploy a new version of the SecureShop application.",
      icon: <Rocket size={22} />,
      method: "POST",
      url: "/resources/application/deploy",
      permission: "application.deploy",
    },

    {
      title: "View Database",
      description:
        "View database status and configuration information.",
      icon: <Database size={22} />,
      method: "GET",
      url: "/resources/database",
      permission: "database.view",
    },

    {
      title: "Modify Database",
      description:
        "Simulate modification of database resources.",
      icon: <Pencil size={22} />,
      method: "PATCH",
      url: "/resources/database",
      permission: "database.modify",
    },

    {
      title: "Create Backup",
      description:
        "Create a simulated backup of the customer database.",
      icon: <Archive size={22} />,
      method: "POST",
      url: "/resources/database/backup",
      permission: "database.backup",
    },
  ];

  return (
    <Layout>

      <div className="p-8">

        {/* HEADER */}
        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Server size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Resource Access Simulator
              </h1>

              <p className="text-sm text-slate-500">
                Test IAM permissions against protected cloud resources.
              </p>
            </div>

          </div>

          <div className="mt-4 flex items-center gap-2">

            <span className="text-sm text-slate-500">
              Logged in as:
            </span>

            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              {user.role || "UNKNOWN"}
            </span>

          </div>

        </div>


        {/* RESULT */}
        {message && (
          <div
            className={`mb-6 border rounded-2xl p-5 ${
              message.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >

            <div className="flex items-start gap-3">

              {message.type === "success" ? (
                <CheckCircle2
                  className="text-green-600 mt-0.5"
                  size={22}
                />
              ) : (
                <XCircle
                  className="text-red-600 mt-0.5"
                  size={22}
                />
              )}

              <div>

                <h3
                  className={`font-semibold ${
                    message.type === "success"
                      ? "text-green-900"
                      : "text-red-900"
                  }`}
                >
                  {message.title}
                </h3>

                <p
                  className={`text-sm mt-1 ${
                    message.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {message.text}
                </p>

                {message.permission && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    Required permission: {message.permission}
                  </p>
                )}

              </div>

            </div>

          </div>
        )}


        {/* RESOURCE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {actions.map((action) => {

            const allowed =
              permissions.includes(action.permission);

            return (
              <div
                key={action.title}
                className={`bg-white border rounded-2xl p-6 transition ${
                  allowed
                    ? "border-slate-200 hover:shadow-md"
                    : "border-red-100"
                }`}
              >

                {/* ICON + STATUS */}
                <div className="flex items-start justify-between">

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      allowed
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {action.icon}
                  </div>

                  {allowed ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">

                      <CheckCircle2 size={14} />

                      ALLOWED

                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">

                      <XCircle size={14} />

                      RESTRICTED

                    </span>
                  )}

                </div>


                <h3 className="font-semibold text-slate-900 mt-5">
                  {action.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-6 min-h-12">
                  {action.description}
                </p>


                {/* REQUIRED PERMISSION */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl">

                  <p className="text-xs text-slate-400">
                    Required permission
                  </p>

                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {action.permission}
                  </p>

                </div>


                {/* BUTTON */}
                <button
                  onClick={() =>
                    runAction(
                      action.title,
                      action.method,
                      action.url
                    )
                  }
                  disabled={
                    !allowed ||
                    loadingAction === action.title
                  }
                  className={`mt-5 w-full py-2.5 rounded-xl text-sm font-medium transition ${
                    allowed
                      ? "bg-slate-950 hover:bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >

                  {!allowed
                    ? "Access Restricted"
                    : loadingAction === action.title
                    ? "Checking permission..."
                    : "Execute Action"}

                </button>

              </div>
            );
          })}

        </div>

      </div>

    </Layout>
  );
}

export default Resources;