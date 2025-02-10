export function permission(allowedPermissions) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.permission) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!allowedPermissions.includes(user.permission)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next(); // User has permission, continue to next middleware/controller
  };
}
