//modules
const express = require("express")
const app = express()
const handlebars = require("express-handlebars")
const mongoose = require("mongoose")
const passport = require("passport")
const path = require("path")
const bodyParser = require("body-parser")
const flash = require("connect-flash")
const session = require("express-session")
const db = require("./config/db")

//require
require("./config/auth")(passport)
require("./models/vehicleData")
require("./models/users")
const users = require("./routes/users")
const vehicleData = require("./routes/vehicleData")
const admin = require("./routes/admin")

//constants
const PORT = process.env.PORT || 8081

//Session
app.use(session({
    secret: "RV9iL10AWRb3",
    resave: true,
    saveUninitialized: true
}))

//Use
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Midldleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//public
app.use(express.static(path.join(__dirname, "public")))

//Handlebars helpers

var helpHandlebars = handlebars.create({
    helpers: {
        ifEquals: function (a, b, options) {
            if (a == b) {
                return options.fn(this)
            } else {
                return options.inverse(this)
            }
        }
    }
})

//Handlebars engine
app.engine("handlebars", helpHandlebars.engine)
app.set("view engine", "handlebars")

//Mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //console.log('Conectado ao mongodb')
    }).catch((erro) => {
        console.log('Erro ao conectar' + erro)
    })

//routes
app.get("/", ensureLoggedIn("/users/login"), (req, res) => {
    res.render("index")
})

app.get("/404", (req, res) => {
    res.send("Erro 404\nPágina não encontrada")
})


app.use("/users", users)
app.use("/vehicleData", vehicleData)
app.use("/admin", admin)

app.listen(PORT)