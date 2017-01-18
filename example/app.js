var express = require('express')
var app = express()
var server = require('http').createServer(app)
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var passport = require('passport')
var path = require('path')
var PaycoStrategy = require('passport-payco').Strategy

// API Access link for creating client ID and secret:
// https://developers.payco.com/
var PAYCO_CLIENT_ID = '--insert-payco-client-id-here--'
var PAYCO_CLIENT_SECRET = '--insert-payco-client-secret-here--'

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Payco profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

// Use the PaycoStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Payco
//   profile), and invoke a callback with a user object.
passport.use(new PaycoStrategy({
  clientID: PAYCO_CLIENT_ID,
  clientSecret: PAYCO_CLIENT_SECRET,
  callbackURL: 'http://127.0.0.1:3000/auth/payco/callback'
},
  function (request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's Payco profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Payco account with a user record in your database,
      // and return that user instead.
      return done(null, profile)
    })
  }
))

// configure Express
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(session({
  secret: 'cookie_secret',
  name: 'payco',
  proxy: true,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', function (req, res) {
  res.render('index', { user: req.user })
})

app.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account', { user: req.user })
})

app.get('/login', function (req, res) {
  res.render('login', { user: req.user })
})

// GET /auth/payco
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Payco authentication will involve
//   redirecting the user to payco.com.  After authorization, Payco
//   will redirect the user back to this application at /auth/payco/callback
app.get('/auth/payco', passport.authenticate('payco'))

// GET /auth/payco/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/payco/callback',
  passport.authenticate('payco', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  function (req, res) {
    res.redirect('/')
  })

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

server.listen(3000, function () {
  console.info('start server.')
})

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}
