const passport = require('passport')

const { Router } = require('express')
const router = Router()

router.get('/current', (req, res) => {
  return res.json({ user: req.user })
})

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('http://localhost:3000/')
})

router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: 'http://localhost:3000/'
  })
)

module.exports = router
