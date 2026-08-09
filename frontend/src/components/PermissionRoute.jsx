import { Navigate } from "react-router-dom";

function PermissionRoute({ permission, children }) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const permissions = user.permissions || [];

  if (!permissions.includes(permission)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default PermissionRoute;