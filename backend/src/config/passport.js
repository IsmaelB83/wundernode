const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autenticar
const { User } = require('../models');

// Local strategy
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({where: {email}});
                if (!user.checkPassword(password)) {
                    return done(null, false, {
                        message: 'Password incorrecto'
                    });       
                }
                return done(null, user, {
                    message: 'Cuenta no existente'
                });
            } catch (error) {
                return done(null, false, {
                    message: 'Cuenta no existente'
                });
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, callback) => {
    callback(null, user);
});

// Deserialize user
passport.deserializeUser((user, callback) => {
    callback(null, user);
});

module.exports = passport;