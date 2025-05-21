// src/config/passport.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Configuración de la estrategia de autenticación con Google
passport.use(
  new GoogleStrategy(
    {
      // Secretos de la aplicación de Google
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Intentar encontrar al usuario por su googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Si no existe, buscar por email para evitar duplicados
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Si existe por email pero no tiene googleId, se actualiza
            user.googleId = profile.id;
            await user.save();
          } else {
            //  Si no existe ni por googleId ni por email, se crea el usuario
            
            const [firstName, ...lastName] = profile.displayName.split(" ");

            user = await User.create({
              googleId: profile.id,
              firstName: firstName,
              lastName: lastName.join(" "),
              email: profile.emails[0].value,
              role: null, // Sin rol asignado todavía
            });
          }
        }

        // Finaliza el proceso, pasando el usuario a la sesión
        return done(null, user);
      } catch (error) {
        console.error("Error en la autenticación con Google:", error.message);
        return done(error, null);
      }
    }
  )
);

//  Serialización y deserialización del usuario para la sesión
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
