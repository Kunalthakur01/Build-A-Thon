const { UnAuthenticatedError } = require("../errors");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new UnAuthenticatedError("Not authorized for this route");
    }
    next();
  };
};

module.exports = { authorizeRoles };