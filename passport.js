import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GithubStrategy from "passport-github";
import { githubLoginCallback, googleLoginCallback } from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(new GithubStrategy(
    {
        clientID: process.env.GH_ID,
        clientSecret: process.env.GH_SECRET,
        callbackURL: `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
    )  
);

passport.use(new GoogleStrategy(
  {
      clientID: process.env.GG_ID,
      clientSecret: process.env.GG_SECRET,
      callbackURL: `http://localhost:4000${routes.googleCallback}`,
  },
  googleLoginCallback
  )
);

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});