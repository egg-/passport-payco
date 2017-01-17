# passport-payco

[![version](https://img.shields.io/npm/v/passport-payco.svg)](https://www.npmjs.com/package/passport-payco) [![download](https://img.shields.io/npm/dm/passport-payco.svg)](https://www.npmjs.com/package/passport-payco)
[![status status](https://travis-ci.org/egg-/passport-payco.svg?branch=master)](https://travis-ci.org/egg-/passport-payco)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Passport](http://passportjs.org/) stratege for autenticating
with Payco using the OAuth 2.0 API.

This module lets you authenticate using [Payco](https://developers.payco.com/) in your Node.js applications.
By plugging into Passport, Payco authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-payco

## Usage

#### Configure Strategy

The Payco authentication strategy authenticates users using a Payco
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a clientID, clientSecret, and callback URL.

```javascript
var PaycoStrategy = require('passport-payco').Strategy

passport.use(new PaycoStrategy({
    clientID: YOUR PAYCO CLIENT ID,
    clientSecret: YOUR PAYCO CLIENT SECRET,
    callbackURL: 'http://127.0.0.1:3000/auth/payco/callback'
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ id: profile.id }, function (err, user) {
      return done(err, user)
    })
  }
))
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'payco'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
```javascript
app.get('/auth/payco',
  passport.authenticate('payco')
)

app.get('/auth/payco/callback',
  passport.authenticate('payco', {
    failureRedirect: '/login',
    successRedirect : '/'
  })
)
```

## Examples

## Thanks to

* [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 [egg](http://github.com/egg-)
