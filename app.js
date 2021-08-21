const express = require('express')
const exphbs = require('express-handlebars')
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const PORT = 5000 || process.env.PORT;
const userRouter = require('./routes/users')

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


//Template Engine Middleware
app.engine('handlebars', exphbs({defaultLayout: 'mainLayout'}));
app.set('view engine', 'handlebars')


//Router Middleware
app.use(userRouter);

app.get('/', (request, response) => {
    response.render('./pages/index')
})

app.use((request, response) => {
    response.render('./static/404')
})

app.listen(PORT, () => {
    console.log('App Started');
});

