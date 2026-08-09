function PermissionGuard({ permission, children }) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const permissions = user.permissions || [];

  if (!permissions.includes(permission)) {
    return null;
  }

  return children;
}

export default PermissionGuard;