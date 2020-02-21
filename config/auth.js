const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//Model de usuário
require("../models/users")
const User = mongoose.model("users")

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: "cpf", passwordField: "password" }, (cpf, password, done) => {
        User.findOne({ cpf: cpf }).then((user) => {
            if (!user) {
                return done(null, false, { message: "CPF ou senha incorretos" })
            }

            bcrypt.compare(password, user.password, (error, invalidPassword) => {
                if (invalidPassword) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: "CPF ou senha incorretos" })
                }
            })

        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}