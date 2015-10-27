var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var Users = require(path.join(__dirname, '..', 'models', 'users'));

authenticator = {
  init: function(){

    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    var githubClientArgs = {
      clientID: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET,
      callbackURL: (baseURL + "sessions/auth/github/callback"),
      scope: ['user:email']
    };

    passport.use(new GitHubStrategy(githubClientArgs, function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        Users.findOrCreate(profile, function (err, id) {
          if(err) throw err;

          // Store internal ID along with passport user info
          profile._id = id;
          return done(null, profile);
        });
      });
    }));
  },

  authorize: function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/sessions/sign_in')
  }
}

module.exports = authenticator;
