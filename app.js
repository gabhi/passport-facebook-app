var express = require('express'),
    passport = require('passport'),
    util = require('util'),
    FacebookStrategy = require('passport-facebook').Strategy,
    logger = require('morgan'),
    session = require('express-session'),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    methodOverride = require('method-override');


    function getZodiacSign(day, month) {

      var zodiacSigns = {
        'capricorn':{"name":"capricorn", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'aquarius':{"name":"aquarius", "trait": "Knowledge, Humanitarian, Serious,Insightful, Duplicitous" },
        'pisces':{"name":"pisces", "trait": "Fluctuation, Depth, Imagination,Reactive, Indecisive" },
        'aries':{"name":"aries", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'taurus':{"name":"taurus", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'gemini':{"name":"gemini", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'cancer':{"name":"cancer", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'leo':{"name":"leo", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'virgo':{"name":"virgo", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'libra':{"name":"libra", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'scorpio':{"name":"scorpio", "trait": "Determination, Dominance, Perservering, Practical, Willful" },
        'sagittarius':{"name":"sagittarius", "trait": "Philosophical, Motion,Experimentation, Optimism" }
      }

      if((month == 1 && day <= 20) || (month == 12 && day >=22)) {
        return zodiacSigns.capricorn;
      } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
        return zodiacSigns.aquarius;
      } else if((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
        return zodiacSigns.pisces;
      } else if((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
        return zodiacSigns.aries;
      } else if((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
        return zodiacSigns.taurus;
      } else if((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
        return zodiacSigns.gemini;
      } else if((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
        return zodiacSigns.cancer;
      } else if((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
        return zodiacSigns.leo;
      } else if((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
        return zodiacSigns.virgo;
      } else if((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
        return zodiacSigns.libra;
      } else if((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
        return zodiacSigns.scorpio;
      } else if((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
        return zodiacSigns.sagittarius;
      }
    }

    var zodiacSigns = {
        120: {html: "&#9809",text: 'Capricorn'},
        218: {html: "&#9810",text: 'Aquarius'},
        320: {html: "&#9811",text: 'Pisces'},
        420: {html: "&#9800",text: 'Aries'},
        521: {html: "&#9801",text: 'Taurus'},
        621: {html: "&#9802",text: 'Gemini'},
        722: {html: "&#9803",text: 'Cancer'},
        823: {html: "&#9804",text: 'Leo'},
        923: {html: "&#9805",text: 'Virgo'},
        1023: {html: "&#9806",text: 'Libra'},
        1122: {html: "&#9807",text: 'Scorpius'},
        1222: {html: "&#9808",text: 'Sagittarius'},
        1231: {html: "&#9809",text: 'Capricorn'}
    };


var FACEBOOK_APP_ID = "1439023756414410"
var FACEBOOK_APP_SECRET = "385329b4386f28157014245242ea44ca";
var CALLBACK_URL = "http://perceptions.io:8000/auth/facebook/callback";
var PORT = 8000;
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {

            // To keep the example simple, the user's Facebook profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Facebook account with a user record in your database,
            // and return that user instead.
            console.log(JSON.stringify(profile));
            return done(null, profile);
        });
    }
));




var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(logger("combined"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
    secret: "superAwsome",
    resave: true,
    saveUninitialized: true
})); // Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.render('index', {
        user: req.user
    });
});

app.get('/account', ensureAuthenticated, function(req, res) {
    console.log(JSON.stringify(req.user))

    var birthday = req.user._json.birthday ;
    var arr = birthday.split("/");

console.log(birthday);
console.log(arr[0]);
console.log(arr[1]);

    var zodiacValue = parseInt(arr[0] + arr[1], 10);
console.log(zodiacValue);

var currentZodiacSign = null;
for (var z in zodiacSigns) {
    try {
        if (currentZodiacSign == null) currentZodiacSign = zodiacSigns[z];
        if (zodiacValue > parseInt(z,10))
            currentZodiacSign = zodiacSigns[z];
        else break;//passed the date - the last one was the right sign. stop looping.
    }
    catch (e) {
    }
}

var zodiacPart = "";
if (currentZodiacSign != null)
    zodiacPart = "<span class='ZodiacSign' title='" + currentZodiacSign.text + "'>" + currentZodiacSign.html + "</span>";





    res.render('account', {
        user: req.user,
        zodiacPart: getZodiacSign(arr[1], arr[0])
    });
});

app.get('/login', function(req, res) {
    res.render('login', {
        user: req.user
    });
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_likes', 'user_status', 'user_birthday'] }),
    function(req, res) {
        // The request will be redirected to Facebook for authentication, so this
        // function will not be called.
    });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/account');
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(PORT);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}
