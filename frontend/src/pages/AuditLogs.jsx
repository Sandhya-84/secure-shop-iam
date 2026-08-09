import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";

import Layout from "../components/Layout";
import api from "../api/axios";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/audit-logs");

      setLogs(response.data.logs || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to fetch audit logs"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const value = `
      ${log.user_name || ""}
      ${log.email || ""}
      ${log.role || ""}
      ${log.action || ""}
      ${log.resource || ""}
      ${log.result || ""}
    `.toLowerCase();

    return value.includes(search.toLowerCase());
  });

  return (
    <Layout>

      <div className="p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Activity size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Audit Logs
              </h1>

              <p className="text-sm text-slate-500">
                Track allowed and denied access attempts.
              </p>
            </div>

          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

        </div>


        {/* SEARCH */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">

          <div className="relative max-w-md">

            <Search
              size={18}
              className="absolute left-4 top-3.5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />

          </div>

        </div>


        {/* LOG TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {loading ? (

            <p className="p-6 text-slate-500">
              Loading audit logs...
            </p>

          ) : error ? (

            <p className="p-6 text-red-600">
              {error}
            </p>

          ) : filteredLogs.length === 0 ? (

            <p className="p-6 text-slate-500">
              No audit logs found.
            </p>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr className="text-left text-sm text-slate-500">

                    <th className="px-6 py-4">
                      User
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Action
                    </th>

                    <th className="px-6 py-4">
                      Resource
                    </th>

                    <th className="px-6 py-4">
                      Result
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredLogs.map((log) => (

                    <tr
                      key={log.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >

                      <td className="px-6 py-4">

                        <div>

                          <p className="font-medium text-slate-800">
                            {log.user_name || "Unknown User"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {log.email}
                          </p>

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                          {log.role || "UNKNOWN"}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span className="text-sm font-medium text-slate-700">
                          {log.action}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {log.resource}
                      </td>

                      <td className="px-6 py-4">

                        {log.result === "ALLOWED" ? (

                          <div className="flex items-center gap-2 text-green-600">

                            <CheckCircle2 size={17} />

                            <span className="text-xs font-semibold">
                              ALLOWED
                            </span>

                          </div>

                        ) : (

                          <div className="flex items-center gap-2 text-red-600">

                            <XCircle size={17} />

                            <span className="text-xs font-semibold">
                              DENIED
                            </span>

                          </div>

                        )}

                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">

                        {log.created_at
                          ? new Date(
                              log.created_at
                            ).toLocaleString()
                          : "-"}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </Layout>
  );
}

export default AuditLogs;