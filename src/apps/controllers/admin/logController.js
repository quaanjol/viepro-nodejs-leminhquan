const mongoose = require('mongoose');
const users = mongoose.model('User');
// const session = require('express-session');

module.exports.login = function(req, res) {
    let error;
    res.render('admin/pages/login', { error });
}

module.exports.postLogin = async function(req, res) {
    const email = req.body.mail;
    const pass = req.body.pass;

    const user = await users.findOne({ user_mail: email });
    if (!user) {
        return res.render('admin/pages/login', {
            error: "Invalid account"
        });
    }

    if (user.user_pass === pass) {
        req.session.user = user;
        return res.redirect('dashboard');
    }
    console.log(user.user_pass);
    return res.render('admin/pages/login', {
        error: "Wrong password"
    });

    // if (email === 'abc@gmail.com' && pass === '123456') {
    //     return res.redirect('dashboard');
    // }

    // return res.render('admin/pages/login', {
    //     error: "Invalid account"
    // });
}

module.exports.logout = function(req, res) {
    req.session.destroy()
    res.redirect("/admin/login")
}