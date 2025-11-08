const { UnAuthenticatedError } = require("../errors");

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnAuthenticatedError("Not authorized for this route");
    }
    next();
  };
};

module.exports = authorizeRoles;