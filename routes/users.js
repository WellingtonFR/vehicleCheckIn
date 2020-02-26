//modules
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const validator = require("validator")
const validateDate = require("../public/js/usefullFunctions")

//birthDate validation
function verifyBirthDate(date) {
    date = date.replace(/\//g, "-"); //substitui barra por hífen
    var date_array = date.split("-"); // quebra a data em array

    if (date_array[0].length != 4) {
        date = new Date(date_array[2], date_array[1] - 1, date_array[0]) // data no formato yyyy/MM/dd
    }

    // comparando as datas
    if (date > new Date()) {
        return true
    }

    return false
}

//require
require("../models/users")
const User = mongoose.model("users")

//routes
router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successReturnToOrRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/register", (req, res) => {
    res.render("users/register")
})

router.post("/register", (req, res) => {

    var erros = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({ message: "Preencher o nome" })
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        erros.push({ message: "Preencher a senha" })
    }

    if (!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null) {
        erros.push({ message: "Preencher o CPF" })
    }

    if (!req.body.phone || typeof req.body.phone == undefined || req.body.phone == null) {
        erros.push({ message: "Preencher o telefone" })
    }

    if (!req.body.vehiclePlate || typeof req.body.vehiclePlate == undefined || req.body.vehiclePlate == null) {
        erros.push({ message: "Preencher a placa do veículo" })
    }

    if (req.body.password.length < 6 || req.body.password.length > 15) {
        erros.push({ message: "A senha deve conter entre 6 e 15 caracteres" })
    } else if (req.body.password != req.body.passwordConfirmation) {
        erros.push({ message: "As senhas digitadas não são iguais" })
    }

    if (erros.length > 0) {
        let viewData = { name: req.body.name, cpf: req.body.cpf, vehiclePlate: vehiclePlate }
        res.render("users/register", { erros: erros, viewData: viewData })
    } else {
        User.findOne({ cpf: req.body.cpf }).then((user) => {
            if (user) {
                req.flash("error_msg", "Já existe um usuário cadastrado com esse CPF")
                res.redirect("/users/register")
            } else {
                const newUser = new User({
                    name: req.body.name,
                    phone: req.body.phone,
                    vehiclePlate: req.body.vehiclePlate,
                    cpf: req.body.cpf,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) {
                            req.flash("error_msg", "Houve um erro ao salvar o cadastro")
                            res.redirect("/")
                        }

                        newUser.password = hash

                        newUser.save().then(() => {
                            req.flash("success_msg", "Cadastro realizado, seja bem vindo !")
                            res.redirect("/users/login")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao salvar o cadastro")
                            res.redirect("/users/register")
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg", "Sua conta foi desconectada")
    res.redirect("/users/login")
})

module.exports = router