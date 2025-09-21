import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import userRepositoryImpl from "../modules/Users/repositories/implementation/users.implementation.repository.mjs";
import { generateId } from "../utils/generateId.mjs";
import PermissionService from "../services/permissionServices.mjs";
import env from "./environment.mjs";
import { logger } from "../middleware/logger.mjs";

// Create instance of user repository
const userRepository = new userRepositoryImpl();

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.accessTokenSecret,
    },
    async (jwt_payload, done) => {
      try {
        const user = await userRepository.findById(jwt_payload.userId);
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Google OAuth Strategy (only if credentials are provided)
if (env.googleClientId && env.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with Google ID
          let user = await userRepository.findByGoogleId(profile.id);

          if (user) {
            return done(null, user);
          }

          // Check if user exists with same email
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;
          if (email) {
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
              // Link Google account to existing user
              const updatedUser = await userRepository.update({
                ...existingUser,
                googleId: profile.id,
              });
              return done(null, updatedUser);
            }
          }

          // Create new user
          const userId = generateId();
          user = await userRepository.create({
            userId: userId,
            firstName: profile.name?.givenName || "Google",
            lastName: profile.name?.familyName || "User",
            email: email,
            username: email || `google_${profile.id}`,
            googleId: profile.id,
            isEmailVerified: true,
          });

          // Assign default USER role to OAuth user
          try {
            await PermissionService.assignDefaultUserRole(userId);
          } catch (error) {
            logger.error("Error assigning default role to OAuth user:", error);
          }

          return done(null, user);
        } catch (error) {
          logger.error("Google OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );
} else {
  logger.info(
    "Google OAuth strategy not initialized - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET"
  );
}

// Facebook OAuth Strategy (only if credentials are provided)
if (env.facebookAppId && env.facebookAppSecret) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: env.facebookAppId,
        clientSecret: env.facebookAppSecret,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ["id", "emails", "name"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with Facebook ID
          let user = await userRepository.findByFacebookId(profile.id);

          if (user) {
            return done(null, user);
          }

          // Check if user exists with same email
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;
          if (email) {
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
              // Link Facebook account to existing user
              const updatedUser = await userRepository.update({
                ...existingUser,
                facebookId: profile.id,
              });
              return done(null, updatedUser);
            }
          }

          // Create new user
          const userId = generateId();
          user = await userRepository.create({
            userId: userId,
            firstName: profile.name?.givenName || "Facebook",
            lastName: profile.name?.familyName || "User",
            email: email,
            username: email || `facebook_${profile.id}`,
            facebookId: profile.id,
            isEmailVerified: true,
          });

          // Assign default USER role to OAuth user
          try {
            await PermissionService.assignDefaultUserRole(userId);
          } catch (error) {
            logger.error("Error assigning default role to OAuth user:", error);
          }

          return done(null, user);
        } catch (error) {
          logger.error("Facebook OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );
} else {
  logger.info(
    "Facebook OAuth strategy not initialized - missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET"
  );
}

// Serialize/Deserialize user (if using sessions)
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await userRepository.findById(userId);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
