const formValidation = require('../validation/formValidation')
module.exports.getUserLogin = (request, response) => {
    response.render("pages/login")
};

module.exports.getUserRegister = (request, response) => {
    response.render("pages/register")
};

module.exports.postUserLogin = (request, response) => {
    response.send("Login Attempted")
};

module.exports.postUserRegister = (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    const validationError = formValidation.registerValidation(
        username,
        password
    )
    if (validationError.length > 0) {
       return response.render("./pages/register", {
            username: username,
            password: password,
            errors: validationError
        });
    }

    response.send("Register Attempted")
};

