module.exports = function(app, passport) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  // app.get('/', function(req, res) {
  //     res.render('index.ejs');
  // });

  app.get('/', function(req, res) {
    res.render('test.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    console.log(req.user.facebook._json.birthday);

    function getZodiacSign(day, month) {

      var zodiacSigns = {
        'capricorn': {
          "name": "capricorn",
          "trait": "Responsible, patient, ambitious, resourceful, loyal"
        },
        'aquarius': {
          "name": "aquarius",
          "trait": "Witty, Clever, Humanitarian, Inventive, Original"
        },
        'pisces': {
          "name": "pisces",
          "trait": "Compassionate, Adaptable, Accepting, Devoted, Imaginative"
        },
        'aries': {
          "name": "aries",
          "trait": "Independent, Generous, Optimistic, Enthusiastic, Courageous"
        },
        'taurus': {
          "name": "taurus",
          "trait": "Dependable, Persistent, Loyal, Patient, Generous"
        },
        'gemini': {
          "name": "gemini",
          "trait": "Energetic, Clever, Imaginative, Witty, Adaptable"
        },
        'cancer': {
          "name": "cancer",
          "trait": "Loyalty, Dependable, Caring, Adaptable, Responsive"
        },
        'leo': {
          "name": "leo",
          "trait": "Confident, Ambitious, Generous, Loyal, Encouraging"
        },
        'virgo': {
          "name": "virgo",
          "trait": "Analytical, Observant, Helpful, Reliable, Precise"
        },
        'libra': {
          "name": "libra",
          "trait": "Diplomatic, Graceful, Peaceful, Idealistic, Hospitable"
        },
        'scorpio': {
          "name": "scorpio",
          "trait": "Loyal, Passionate, Resourceful, Observant, Dynamic"
        },
        'sagittarius': {
          "name": "sagittarius",
          "trait": "Independent, Optimistic, Cheerful, Honest, Intellectual"
        }
      }

      if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
        return zodiacSigns.capricorn;
      } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
        return zodiacSigns.aquarius;
      } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
        return zodiacSigns.pisces;
      } else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
        return zodiacSigns.aries;
      } else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
        return zodiacSigns.taurus;
      } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
        return zodiacSigns.gemini;
      } else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
        return zodiacSigns.cancer;
      } else if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
        return zodiacSigns.leo;
      } else if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
        return zodiacSigns.virgo;
      } else if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
        return zodiacSigns.libra;
      } else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
        return zodiacSigns.scorpio;
      } else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
        return zodiacSigns.sagittarius;
      }
    }


    var _json = JSON.parse(req.user.facebook._json);
    var zodiacPart = "";


    if (req.user.facebook.birthday) {
      var birthday = req.user.facebook.birthday;
      var arr = birthday.split("/");
      zodiacPart = getZodiacSign(arr[1], arr[0]);

    }


    var books = (_json.books) ? "books, " : null;
    var television = _json.television ? "television, " : null;
    var music = _json.music ? "music, " : null;
    var favorite_athletes = _json.favorite_athletes ? "sports" : null;
    var favorite_teams = _json.favorite_teams ? "teams" : null;

    var sports = null;
    if (favorite_athletes || favorite_teams) sports = "sports";


    var msg = "You are into " + books + television + music + sports;
    //<strong>You seem to be </strong>:
    //if(req.user.facebook._json.books) msg += "books, ";
    console.log(JSON.stringify(_json.posts.data, null, 2))
    res.render('profile.ejs', {
      user: req.user,
      _json: _json,
      zodiacPart: zodiacPart,
      msg: msg
    });
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'user_likes', 'user_status',
      'user_birthday', 'user_actions.books', 'user_actions.music',
      'user_friends', 'user_education_history'
    ]
  }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // twitter --------------------------------

  // send to twitter to do the authentication
  app.get('/auth/twitter', passport.authenticate('twitter', {
    scope: 'email'
  }));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));


  // google ---------------------------------

  // send to google to do the authentication
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  // locally --------------------------------
  app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', {
      message: req.flash('loginMessage')
    });
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // facebook -------------------------------

  // send to facebook to do the authentication
  app.get('/connect/facebook', passport.authorize('facebook', {
    scope: 'email'
  }));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback',
    passport.authorize('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // twitter --------------------------------

  // send to twitter to do the authentication
  app.get('/connect/twitter', passport.authorize('twitter', {
    scope: 'email'
  }));

  // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback',
    passport.authorize('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));


  // google ---------------------------------

  // send to google to do the authentication
  app.get('/connect/google', passport.authorize('google', {
    scope: ['profile', 'email']
  }));

  // the callback after google has authorized the user
  app.get('/connect/google/callback',
    passport.authorize('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // facebook -------------------------------
  app.get('/unlink/facebook', isLoggedIn, function(req, res) {
    var user = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // twitter --------------------------------
  app.get('/unlink/twitter', isLoggedIn, function(req, res) {
    var user = req.user;
    user.twitter.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // google ---------------------------------
  app.get('/unlink/google', isLoggedIn, function(req, res) {
    var user = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
