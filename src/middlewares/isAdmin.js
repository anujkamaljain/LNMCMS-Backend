const isAdmin = (req, res, next) => {
  if(req.user && req.user.role === "admin"){
    return next();
  }
  return res.status(403).json({ message: "Access denied. You are not an admin." });
};

module.exports = isAdmin;