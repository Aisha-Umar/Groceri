const passport = require("passport")

// exports.login = (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login',
//     failureFlash: true
//   })(req, res, next);
// };
exports.login = (req, res, next) => {
  console.log('Login POST called', req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Auth error:', err);
      return next(err);
    }
    if (!user) {
      console.log('Login failed:', info.message);
      req.flash('error_msg', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log('Login success:', user.email);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
};


exports.getLogin = async(req,res) => {
  res.render('login')
}