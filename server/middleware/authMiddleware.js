import jwt from "jsonwebtoken";

/**
 * Validates the normal account authentication token.
 *
 * Expected header:
 * Authorization: Bearer <token>
 */
const authenticateUser = (req, res, next) => {
  try {
    const authorizationHeader =
      req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "You must log in before accessing this resource.",
      });
    }

    const authToken =
      authorizationHeader.split(" ")[1];

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message:
          "A valid authentication token is required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not configured.",
      );
    }

    const decodedToken = jwt.verify(
      authToken,
      process.env.JWT_SECRET,
    );

    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message:
          "Your login session has expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message:
          "Your authentication token is invalid. Please log in again.",
      });
    }

    console.error(
      "Unable to authenticate user:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected authentication error occurred.",
    });
  }
};

/**
 * Restricts an endpoint to specified roles.
 *
 * Example:
 * authorizeRoles("Coach", "Organizer")
 */
const authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication is required.",
      });
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account role is not authorized to perform this action.",
      });
    }

    next();
  };

export {
  authenticateUser,
  authorizeRoles,
};