var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, login, password, done) {
    process.nextTick(function() {
      User.findOne({ 'login':  login }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {
          var newUser = new User();
          console.log(newUser.local);
          newUser.login = login;
          newUser.password = newUser.generateHash(password);
          newUser.type = req.body.type;
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, login, password, done) {
    console.log("fuuuuuuuuuck");
    console.log(login);
    console.log(password);
    User.findOne({ 'login': login }, function(err, user) {
        console.log(user);
        console.log('password');
      if (err){
        console.log('err');
        return done(err);
      }
      if (!user){
          console.log('user notFound');
          return done(null, false, {'loginMessage': 'No user found.'});
      }
      if (!user.validPassword(password)){
        console.log('wrong pass')
        return done(null, false, {'loginMessage': 'Oops! Wrong password.'});
      }
      console.log('réussi')
      return done(null, user);
    });
  }));

};
