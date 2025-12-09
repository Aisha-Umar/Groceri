const bcrypt = require('bcryptjs');
const User = require('../models/user');

// SIGNUP (REGISTER)
exports.signup = async (req, res) => {
  try {
    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // 2. Create the user with hashed password
    await User.create({
      username: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    req.flash("success_msg", "Account created! You can now log in.");
    return res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Something went wrong. Try Again.");
    return res.redirect('/signup');
  }
};


exports.getSignUp = async(req,res) => {
  try{
    await res.render('signup')
  } catch(err){
    res.status(500).json({ message: err.message})
  }
}


