const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// Azure AD authentication strategy configuration
passport.use(
  new OIDCStrategy(
    {
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      responseType: "code id_token",
      responseMode: "form_post",
      redirectUrl: "http://localhost:4003/auth/callback",
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      validateIssuer: true,
      passReqToCallback: false,
      scope: ["profile", "email", "offline_access"],
    },
    (iss, sub, profile, accessToken, refreshToken, done) => {
      // Add detailed log to check the entire profile
      console.log(
        "Full Profile returned by Azure AD:",
        JSON.stringify(profile, null, 2)
      );

      if (!profile) {
        return done(new Error("No profile found"), null);
      }

      // Log the Object ID (or whichever ID field Azure provides)
      if (profile.oid) {
        console.log("User authenticated with OID:", profile.oid);
      } else {
        console.error("Profile does not contain 'oid'. Profile:", profile);
      }

      return done(null, profile);
    }
  )
);

// Passport user serialization and deserialization
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user); 
  console.trace();
  if (user && user.oid) {
    done(null, user.oid); // Use 'oid' as the unique identifier
  } else {
    done(new Error("No OID found in user profile"), null);
  }
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing user with OID:", id);
  // In a real-world app, you'd look up the user from your database here
  done(null, { oid: id });
});

// Define authentication routes and handlers
const authController = {
  // Redirect to Microsoft login page
  login: (req, res, next) => {
    passport.authenticate("azuread-openidconnect", {
      response: res,
      prompt: "login",
      failureRedirect: "/error", // Redirect to error page on failure
    })(req, res, next);
  },

  // Handle the authentication callback
  callback: (req, res, next) => {
    console.log("Auth callback triggered");
    passport.authenticate("azuread-openidconnect", {
      failureRedirect: "/error",
    })(req, res, (err) => {
      // Note: we only check for error here
      if (err) {
        console.error("Authentication failed:", err);
        return res.redirect("/error");
      }

      // At this point, if authentication succeeded, req.user should be set
      if (!req.user) {
        console.error("No user in request after authentication");
        return res.redirect("/error");
      }

      console.log("User logged in successfully:", req.user);
      return res.redirect("/protected");
    });
  },

  // On successful authentication, redirect to the protected page
  authSuccess: (req, res) => {
    res.send("Welcome to the protected page! You are authenticated.");
  },

  authFailure: (req, res) => {
    res.send("Authentication failed. Please try again.");
  },

  // Register a new user (for local login)
  register: (req, res) => {
    const { username, password, ConfirmPassword } = req.body;

    db.query(
      "SELECT username FROM users WHERE username = ?",
      [username],
      async (error, results) => {
        if (error) console.log(error);

        if (results.length > 0) {
          return res.render("register", { message: "Username already taken" });
        } else if (password !== ConfirmPassword) {
          return res.render("register", { message: "Passwords do not match" });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query(
          "INSERT INTO users SET ?",
          { username: username, password: hashedPassword },
          (error, results) => {
            if (error) console.log(error);

            return res.redirect("/login");
          }
        );
      }
    );
  },

  // Login a user with local username/password
  loginLocal: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render("login", {
        message: "Please enter both username and password.",
      });
    }

    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (error, results) => {
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          return res.status(401).render("login", {
            message: "Username or password is incorrect",
          });
        } else {
          const id = results[0].id;
          const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          const cookieOptions = {
            expires: new Date(
              Date.now() +
                process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          res.cookie("jwt", token, cookieOptions);
          return res.redirect("/home");
        }
      }
    );
  },
};

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

module.exports = authController;
