const express = require('express')
const path = require('path')
const app = express()
const bodyparser = require('body-parser')
require('../libs/mongo-db')
const session = require('express-session')
const router = require('../routes/api')

app.use(
    session({
        secret: "Quandeptrai"
    })
);

// share data
app.use(require("../apps/middlewares/sharedData"));

app.use("/admin/dashboard",
    (req, res, next) => {
        console.log("1")
        next()

    }, (req, res, next) => {
        console.log("2")
        next()
    })

app.use((req, res, next) => {
    // console.log(req.session)
    next();
})

app.use('/access', express.static(path.join(__dirname, "..", "public")));

//using body parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//using tempplate engine
app.set("views", path.join(__dirname, "..", "apps", "views"));
app.set("view engine", "ejs");

// console.log(app);

app.use("/api", require("../routes/api"));
app.use("/", require("../routes/web"));

app.use("*", function(req, res) {
    return res.render("client/pages/404");
});

app.use((err, req, res, next) => {
    //fix errors for the website
    console.log(err);
    return res.render("client/pages/404")
})

module.exports = app;

// console.log(path.join(__dirname, "..", "public"));