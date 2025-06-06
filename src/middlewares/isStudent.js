const isStudent = (req, res, next) => {
  if(req.user && req.user.role === "student"){
    return next();
  }
  return res.status(403).json({ message: "Access denied. You are not a student." });
};

module.exports = isStudent;