const formValidation = require('../validation/formValidation')
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const errors = []
module.exports.getUserLogin = (request, response, next) => {
    response.render("pages/login")
};

module.exports.getUserRegister = (request, response, next) => {
    response.render("pages/register")
};

module.exports.postUserLogin = (request, response, next) => {
    response.send("Login Attempted")
};

module.exports.postUserRegister = (request, response, next) => {
    const username = request.body.username;
    const password = request.body.password;

    const validationError = formValidation.registerValidation(
        username,
        password
    );
    if (validationError.length > 0) {
        return response.render("./pages/register", {
            username: username,
            password: password,
            errors: validationError
        });
    }
    User.findOne({
        username
    }).then(user => {
        if (user) {
            //Email Validation
            errors.push({message: "Username Already In Use"})
            return response.render("pages/register", {
                username,
                password,
                errors
            })
        }
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) throw  err;
                const newUser = new User({
                    username: username,
                    password: hash
                })
                newUser
                    .save()
                    .then(() => {
                        console.log("Successfull")
                        response.redirect('/')
                    })
                    .catch(err => console.log(err));
            });
        });
    })
        .catch(err => console.log(err))


};

