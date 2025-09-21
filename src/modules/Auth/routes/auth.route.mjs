import Router from "express";
import passport from "passport";

import registerController from "../controllers/auth.register.controller.mjs";
import loginController from "../controllers/auth.login.controller.mjs";
import logoutController from "../controllers/auth.logout.controller.mjs";
import refreshController from "../controllers/auth.refresh.controller.mjs";
import emailVerifyController from "../controllers/auth.email.controller.mjs";
import generateVerificationToken from "../controllers/auth.emailToken.controller.mjs";
import forgetPasswordController from "../controllers/auth.forget.controller.mjs";
import resetPasswordController from "../controllers/auth.reset.controller.mjs";
import googleLoginController from "../controllers/auth.google.controller.mjs";
import facebookLoginController from "../controllers/auth.facebook.controller.mjs";

import authenticate from "../../../middleware/authenticate.mjs";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh", refreshController);
router.post("/verify-email/:token", authenticate, emailVerifyController);
router.post("/verify-email", authenticate, generateVerificationToken);
router.post("/forget-password", forgetPasswordController);
router.post("/reset-password/:token", resetPasswordController);

// OAuth Routes
// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleLoginController
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  facebookLoginController
);

export default router;
