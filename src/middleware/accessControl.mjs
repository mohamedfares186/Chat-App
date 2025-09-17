import logger from "./logger.mjs";

const selfAccess = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.params.userId || req.query.userId;
    if (!userId) return res.status(400).json({ error: "Access Denied" });

    if (String(req.user.userId) === String(userId)) return next();

    return res.status(403).json({ error: "Access Denied" });
  } catch (error) {
    logger.warn(`Self access error: ${error}`);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default selfAccess;
