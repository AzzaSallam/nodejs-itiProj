import jwt from "jsonwebtoken";

export const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      };
    } catch (err) {
      req.user = null; 
    }
  } else {
    req.user = null; 
  }
  next();
};
