/* globals it describe */

var assert = require('assert')
var PaycoStrategy = require('../')

describe('PaycoStrategy', function () {
  var strategy = new PaycoStrategy({
    clientID: 'ABC123',
    clientSecret: 'secret'
  }, function () {})

  describe('strategy', function () {
    it('should be named payco', function (done) {
      assert.equal(strategy.name, 'payco')

      done()
    })
  })

  describe('strategy when loading user profile', function () {
    // mock
    strategy._oauth2.get = function (url, accessToken, callback) {
      var body = JSON.stringify(require('./fixtures/profile.json'))
      callback(null, body, undefined)
    }

    describe('when told to load user profile', function () {
      strategy.userProfile('access-token', function (err, profile) {
        it('should not error', function (done) {
          assert.equal(err, null)

          done()
        })

        it('should load profile', function (done) {
          assert.equal(profile.provider, 'payco')
          assert.equal(profile.id, 'cbbbabbb870-e99a-11e4-bb48-cbcddd66d218')
          assert.equal(profile.displayName, 'test****@nate.com')
          assert.equal(profile.email, 'test407@nate.com')
          assert.equal(profile.emails[0].value, 'test407@nate.com')

          done()
        })

        it('should set raw property', function (done) {
          assert.equal(typeof profile._raw, 'string')

          done()
        })

        it('should set json property', function (done) {
          assert.equal(typeof profile._json, 'object')

          done()
        })
      })
    })
  })

  describe('strategy when loading user profile and encountering an error', function () {
    // mock
    strategy._oauth2.get = function (url, accessToken, callback) {
      callback(new Error('something-went-wrong'))
    }

    describe('when told to load user profile', function () {
      strategy.userProfile('access-token', function (err, profile) {
        it('should error', function (done) {
          assert.notEqual(err, null)

          done()
        })

        it('should wrap error in InternalOAuthError', function (done) {
          assert.equal(err.constructor.name, 'InternalOAuthError')

          done()
        })

        it('should not load profile', function (done) {
          assert.equal(profile, undefined)

          done()
        })
      })
    })
  })
})
