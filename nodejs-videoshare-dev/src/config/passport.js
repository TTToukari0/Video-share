import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models";

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      // Search an existing email
      const userFound = await User.findOne({ email });

      // return an error if the email already exists
      if (userFound) {
        return done(null, false, { message: "The username is already Taken" });
      }

      // create a new User
      const newUser = new User();
      newUser.email = email;
      newUser.password = await User.encryptPassword(password);
      if (req.body.is_creator=="1"){
        newUser.is_creator = req.body.is_creator=="1";
      }else{
        newUser.is_creator = false;
      }
//      newUser.is_creator = req.body.is_creator=="1";
//      console.log(req.body);
      newUser.is_creator = req.body.is_creator;
      const userSaved = await newUser.save();

      // create a success message
      req.flash("success", "successful create a new user");

      // return the session
      return done(null, userSaved);
    }
  )
);

passport.use(
  "signin",
  new LocalStrategy(
    {
      passwordField: "password",
      usernameField: "email",
    },
    async (email, password, done) => {
      // Find the user by email
      const userFound = await User.findOne({ email });

      // if user does not exists
      if (!userFound) return done(null, false, { message: "Not User found." });

      // match password
      const match = await userFound.matchPassword(password);

      if (!match) return done(null, false, { message: "Incorrect Password." });

      return done(null, userFound);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = (await User.findById(id)).toObject();
    // delete the user from object respones
    if (user) {
      delete user.password;
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});
