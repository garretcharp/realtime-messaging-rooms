const passport = require('passport')

const { Router } = require('express')
const router = Router()

router.get('/current', (req, res) => {
  return res.json({ user: req.user })
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
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
  })
)

module.exports = router
