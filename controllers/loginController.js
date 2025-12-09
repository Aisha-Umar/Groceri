const passport = require("passport")

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};


exports.getLogin = async(req,res) => {
  try{
    await res.render('login')
  } catch(err){
    res.status(500).json({ message: err.message})
  }
}