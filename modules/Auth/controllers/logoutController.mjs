import envConfig from "../../../config/environment.mjs";

const logoutController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies["refresh-token"])
      return res.status(401).json({ Error: "Unauthorized" });
    res.clearCookie("refresh-token", {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 0,
    });
    res.clearCookie("access-token", {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 0,
    });
    res.clearCookie("x-csrf-token", {
      httpOnly: true,
      secure: envConfig.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 0,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.error(`Error logging out: ${error}`);
    return res.status(500).json({ Error: "Something went wrong" });
  }
};

export default logoutController;
