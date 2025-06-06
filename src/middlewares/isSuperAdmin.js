const isSuperAdmin = (req, res, next) => {
  if(req.user && req.user.role === "superAdmin"){
    return next();
  }
  return res.status(403).json({ message: "Access denied. You are not a Superadmin." });
};

module.exports = isSuperAdmin;