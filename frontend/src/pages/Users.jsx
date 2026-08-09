import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Plus,
} from "lucide-react";
import PermissionGuard from "../components/PermissionGuard";

import Layout from "../components/Layout";
import api from "../api/axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "DEVELOPER",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.users || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users", form);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "DEVELOPER",
      });

      setShowForm(false);

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to create user"
      );
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, {
        role,
      });

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to change role"
      );
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const newStatus =
        status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";

      await api.patch(`/users/${id}/status`, {
        status: newStatus,
      });

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to change status"
      );
    }
  };

  return (
    <Layout>

      <div className="p-8">

        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <UsersIcon size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                User Management
              </h1>

              <p className="text-sm text-slate-500">
                Manage identities and IAM roles.
              </p>
            </div>

          </div>

         <PermissionGuard permission="user.create">

  <button
    onClick={() => setShowForm(!showForm)}
    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl"
  >
    <Plus size={18} />
    Add User
  </button>

</PermissionGuard>

        </div>


        {showForm && (

          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

            <h2 className="font-semibold text-slate-900 mb-5">
              Create New User
            </h2>

            <form
              onSubmit={handleCreateUser}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="border border-slate-200 rounded-xl px-4 py-3"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="border border-slate-200 rounded-xl px-4 py-3"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="border border-slate-200 rounded-xl px-4 py-3"
                required
              />

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
                className="border border-slate-200 rounded-xl px-4 py-3"
              >
                <option value="DEVELOPER">
                  Developer
                </option>

                <option value="DBA">
                  DBA
                </option>

                <option value="AUDITOR">
                  Auditor
                </option>

                <option value="ADMIN">
                  Admin
                </option>
              </select>

              <button
                type="submit"
                className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-medium"
              >
                Create User
              </button>

            </form>

          </div>

        )}


        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {loading ? (

            <p className="p-6 text-slate-500">
              Loading users...
            </p>

          ) : error ? (

            <p className="p-6 text-red-600">
              {error}
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
                      Email
                    </th>

                    <th className="px-6 py-4">
                      Role
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr
                      key={user.id}
                      className="border-b border-slate-100 last:border-0"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                            {user.name?.charAt(0)}
                          </div>

                          <span className="font-medium text-slate-800">
                            {user.name}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">

                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value
                            )
                          }
                          className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="ADMIN">
                            ADMIN
                          </option>

                          <option value="DEVELOPER">
                            DEVELOPER
                          </option>

                          <option value="DBA">
                            DBA
                          </option>

                          <option value="AUDITOR">
                            AUDITOR
                          </option>
                        </select>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            handleStatusChange(
                              user.id,
                              user.status
                            )
                          }
                          className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                            user.status === "ACTIVE"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {user.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>

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

export default Users;