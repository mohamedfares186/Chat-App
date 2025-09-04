import jwt from "jsonwebtoken";
import envConfig from "../config/environment.mjs";

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    const token = req.cookies["access-token"];
    if (!token) return res.status(401).json({ Error: "Unauthorized" });
    jwt.verify(token, envConfig.accessTokenSecret, (err, decoded) => {
      if (err) return res.status(403).json({ Error: "Access Denied" });
      const role = decoded.role;
      if (!allowedRoles.includes(role))
        return res.status(403).json({ Error: "Access Denied" });
      req.user = decoded;
      return next();
    });
  };

export default authorize;
