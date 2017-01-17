'use strict'
/**
 * Module dependencies.
 */
var util = require('util')
var OAuth2Strategy = require('passport-oauth2')
var InternalOAuthError = require('passport-oauth2').InternalOAuthError

/**
 * `Strategy` constructor.
 *
 * The Payco authentication strategy authentications requests by delegating to
 * Payco using the OAuto 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Payco application's client id
 *   - `clientSecret`  your Payco application's client secret
 *   - `callbackURL`   URL to which Payco will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new PaycoStrategy({
 *         clientID: 'clientid',
 *         clientSecret: 'secret'
 *         callbackURL: 'https://www.example.net/auth/payco/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user)
 *         })
 *       }
 *     ))
 *
 * @param {object} options
 * @param {function} verify
 */
function Strategy (options, verify) {
  options = options || {}
  options.authorizationURL = options.authorizationURL || 'https://id.payco.com/oauth2.0/authorize'
  options.tokenURL = options.tokenURL || 'https://id.payco.com/oauth2.0/token'

  OAuth2Strategy.call(this, options, verify)
  this.name = 'payco'
}

/**
 * Inherit from `OAuth2Strategy`
 */
util.inherits(Strategy, OAuth2Strategy)

/**
 * Retrieve user profile from Payco.
 *
 * This function constructs a nomalized profile, with the following properties:
 *
 *  - `provider`      always set to 'payco`
 *  - `id`
 *  - `displayName`
 *  - `emails`
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get('https://apis.krp.toastoven.net/payco/friends/getProfileBasicByFriendsToken.json', accessToken, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err))
    }

    try {
      var json = JSON.parse(body)

      var profile = { provider: 'payco' }
      var profileBasic = json.profileBasic

      profile.id = profileBasic.idNo
      profile.displayName = profileBasic.maskingId
      profile.email = profileBasic.id
      profile.emails = [
        { value: profileBasic.id }
      ]

      profile._raw = body
      profile._json = json

      done(null, profile)
    } catch (e) {
      done(e)
    }
  })
}

/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy

/**
 * Export constructors.
 */
exports.Strategy = Strategy
