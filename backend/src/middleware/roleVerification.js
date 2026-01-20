import UserRole from "../enum/userRole.js";

export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userInfo) {
      return res
        .status(401)
        .json({
          error: "User information not found. Please verify token first.",
        });
    }

    const userRole = req.userInfo.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions.",
        message: `This action requires one of the following roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};
