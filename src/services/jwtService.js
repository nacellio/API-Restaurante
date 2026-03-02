import jwt from "jsonwebtoken";

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { signToken, verifyToken };
