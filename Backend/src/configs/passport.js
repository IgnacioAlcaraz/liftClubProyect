const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Configuración de la estrategia de autenticación con Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            
            const [firstName, ...lastName] = profile.displayName.split(" ");

            user = await User.create({
              googleId: profile.id,
              firstName: firstName,
              lastName: lastName.join(" "),
              email: profile.emails[0].value,
              role: null, 
            });
          }
        }

        return done(null, user);
      } catch (error) {
        console.error("Error en la autenticación con Google:", error.message);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Error al deserializar el usuario:", error.message);
    done(error, null);
  }
});
