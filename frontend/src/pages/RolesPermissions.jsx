import { useEffect, useState } from "react";
import {
  KeyRound,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Layout from "../components/Layout";
import api from "../api/axios";

function RolesPermissions() {
  const [matrix, setMatrix] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      const response = await api.get("/roles/matrix");

      setMatrix(response.data.matrix || {});
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to fetch permission matrix"
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = Object.keys(matrix);

  const allPermissions = [
    ...new Set(
      Object.values(matrix).flat()
    ),
  ];

  return (
    <Layout>
      <div className="p-8">

        {/* HEADER */}
        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <KeyRound size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Roles & Permissions
              </h1>

              <p className="text-sm text-slate-500">
                Least privilege permission matrix
              </p>
            </div>

          </div>

        </div>


        {/* INFO CARD */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6">

          <h3 className="font-semibold text-indigo-900">
            Principle of Least Privilege
          </h3>

          <p className="text-sm text-indigo-700 mt-2 leading-6">
            Each IAM role receives only the permissions
            required to perform its responsibilities.
          </p>

        </div>


        {/* MATRIX */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {loading ? (
            <p className="p-6 text-slate-500">
              Loading permissions...
            </p>
          ) : error ? (
            <p className="p-6 text-red-600">
              {error}
            </p>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm text-slate-600">
                      Permission
                    </th>

                    {roles.map((role) => (
                      <th
                        key={role}
                        className="px-6 py-4 text-center text-sm text-slate-600"
                      >
                        {role}
                      </th>
                    ))}

                  </tr>

                </thead>

                <tbody>

                  {allPermissions.map((permission) => (

                    <tr
                      key={permission}
                      className="border-b border-slate-100 last:border-0"
                    >

                      <td className="px-6 py-4">

                        <div>
                          <p className="font-medium text-slate-800">
                            {permission}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            IAM permission
                          </p>
                        </div>

                      </td>

                      {roles.map((role) => {

                        const allowed =
                          matrix[role]?.includes(permission);

                        return (
                          <td
                            key={role}
                            className="px-6 py-4 text-center"
                          >

                            {allowed ? (
                              <CheckCircle2
                                className="text-green-500 mx-auto"
                                size={20}
                              />
                            ) : (
                              <XCircle
                                className="text-red-400 mx-auto"
                                size={20}
                              />
                            )}

                          </td>
                        );
                      })}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* LEGEND */}
        <div className="flex gap-6 mt-5 text-sm">

          <div className="flex items-center gap-2 text-slate-600">

            <CheckCircle2
              size={17}
              className="text-green-500"
            />

            Allowed

          </div>

          <div className="flex items-center gap-2 text-slate-600">

            <XCircle
              size={17}
              className="text-red-400"
            />

            Denied

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default RolesPermissions;