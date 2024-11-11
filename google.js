const dotenv = require("dotenv");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

dotenv.config({ path: "./.env" });


app.use( session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our db
        const email = profile.emails[0].value;

        if (email.endsWith("@timePawa.com")) {
            return done(null, profile);
        }
        else{
            return done(new Error("User not allowed"), null);
        }
        return done(null, profile);
    }
))

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})

app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with Google</a>");
})

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/profile");
    }
);
app.get("/profile", (req, res) => {
    res.send(`Welcome ${req.user.displayName}`);
});

app.get("/logout", (req, res) => {
    req.logout(() => {});
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});