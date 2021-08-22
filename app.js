const express = require('express')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')

const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const PORT = 5000 || process.env.PORT;
const userRouter = require('./routes/users')
const User = require('./models/User')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require("cookie-parser")
const {request, response} = require("express");

const passport = require('passport')

//Flash Middleware

app.use(cookieParser("passporttutorial"))
app.use(session({
    cookie: {maxAge: 6000},
    resave: true,
    secret: "passporttutorial",
    saveUninitialized: true
}))
app.use(flash());

//Passport Initialize

app.use(passport.initialize());
app.use(passport.session());

//Global - Res.Locals

app.use((request, response, next) => {

    response.locals.flashSuccess = request.flash("flashSuccess");
    response.locals.flashError = request.flash("flashError");

    response.locals.passportFailure = request.flash("error");
    response.locals.passportSuccess = request.flash("success");

    //Our Logged In User
    response.locals.user = request.user;
    next();
});

//MongoDb Connection
const ConnectionURL = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
mongoose.connect(ConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error"))

db.once("open", () => {
    console.log("Connected to Database")
})

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));


app.engine('handlebars', exphbs({
        defaultLayout: 'mainLayout',
        // ...implement newly added insecure prototype access
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
);

app.set('view engine', 'handlebars')


//Router Middleware
app.use(userRouter);

app.get('/', (request, response, next) => {
    User.find({})
        .lean()
        .then(users => {
            response.render("./pages/index", {users: users})
        })
        .catch(err => response.status(500).send(err),
        );
    response.render('./pages/index')
})

app.use((request, response) => {
    response.render('./static/404')
})

app.listen(PORT, () => {
    console.log('App Started');
});

