const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validateUserAndGenerateToken = async (user, password) => {
  if (!user) {
    throw new Error("Incorrect login credentials.");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    return token;
  } else {
    throw new Error("Incorrect login credentials.");
  }
};

module.exports = validateUserAndGenerateToken;
