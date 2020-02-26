const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const passport = require("passport")
const bodyParser = require("body-parser")
const validator = require("validator")
const moment = require("moment")
ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn, app = express()

require("../models/vehicleData")
const vehicleData = mongoose.model("vehicleData")
require("../models/users")
const user = mongoose.model("users")

router.get("/", ensureLoggedIn("/users/login"), (req, res) => {
    if (req.user.isAdmin) {
        vehicleData
            .find({ isChecked: false })
            .sort({ date: -1 })
            .then((data) => {
                let viewData = {}
                for (let i = 0; i < data.length; i++) {
                    viewData[i] = {
                        day: moment(data[i].date).format("DD/MM/YYYY"),
                        hour: moment(data[i].date).format("HH:mm"),
                        id: data[i]._id,
                        dock: data[i].dock,
                        name: data[i].name,
                        vehiclePlate: data[i].vehiclePlate,
                        phone: data[i].phone,
                    }
                }
                res.render("admin/index", { viewData: viewData })
            }).catch((err) => {
                req.flash("error_msg", "Não foi possível localizar os dados")
                res.redirect("/")
            })
    } else {
        req.flash("error_msg", "Você não tem permissão para acessar essa página")
        res.redirect("/")
    }
})

router.get("/filter", ensureLoggedIn("/users/login"), (req, res) => {
    if (req.user.isAdmin) {

        let initialDate
        let finalDate

        if (Object.keys(req.query.initialDate).length != 0) {
            initialDate = moment.utc(req.query.initialDate, "DD/MM/YYYY")
        }
        if (Object.keys(req.query.finalDate).length != 0) {
            finalDate = moment.utc(req.query.finalDate, "DD/MM/YYYY")
        }

        if (initialDate && !finalDate)
            vehicleData
                .find({ date: { $gte: new Date(initialDate) } })
                .where({ isChecked: false })
                .sort({ date: -1 })
                .then((data) => {
                    let viewData = {}
                    for (let i = 0; i < data.length; i++) {
                        viewData[i] = {
                            day: moment(data[i].date).format("DD/MM/YYYY"),
                            hour: moment(data[i].date).format("HH:mm"),
                            id: data[i].id,
                            dock: data[i].dock,
                            name: data[i].name,
                            vehiclePlate: data[i].vehiclePlate,
                            phone: data[i].phone,
                        }
                    }
                    res.render("admin/index", { viewData: viewData })
                }).catch((err) => {
                    req.flash("error_msg", "Não foi possível encontrar os dados")
                    res.redirect("/")
                })

        if (initialDate && finalDate)
            vehicleData
                .find({ date: { $gte: new Date(initialDate), $lte: new Date(finalDate) } })
                .where({ isChecked: false })
                .sort({ date: -1 })
                .then((data) => {
                    let viewData = {}
                    for (let i = 0; i < data.length; i++) {
                        viewData[i] = {
                            day: moment(data[i].date).format("DD/MM/YYYY"),
                            hour: moment(data[i].date).format("HH:mm"),
                            id: data[i].id,
                            dock: data[i].dock,
                            name: data[i].name,
                            vehiclePlate: data[i].vehiclePlate,
                            phone: data[i].phone,
                        }
                    }
                    res.render("admin/index", { viewData: viewData })
                }).catch((err) => {
                    req.flash("error_msg", "Não foi possível encontrar os dados")
                    res.redirect("/")
                })
    } else {
        req.flash("error_msg", "Você não tem permissão para acessar essa página")
        res.redirect("/")
    }
})

router.post("/confirmVehicle", ensureLoggedIn("/users/login"), (req, res) => {
    if (req.user.isAdmin) {
        vehicleData
            .findOne({ _id: req.body.id })
            .then((data) => {

                data.isChecked = true

                data.save().then(() => {
                    res.redirect("/admin")
                }).catch((err) => {
                    req.flash("error_msg", "Não foi possível salvar os dados")
                    res.redirect("admin/index")
                })
            }).catch((err) => {
                console.log(err)
                req.flash("error_msg", "Não foi possível localizar os dados")
                res.redirect("admin/index")
            })
    } else {
        req.flash("error_msg", "Você não tem permissão para acessar essa página")
        res.redirect("/")
    }
})

router.get("/viewAll", ensureLoggedIn("/users/login"), (req, res) => {
    if (req.user.isAdmin) {
        vehicleData
            .find()
            .sort({ date: -1 })
            .then((data) => {
                let viewData = {}
                for (let i = 0; i < data.length; i++) {
                    viewData[i] = {
                        day: moment(data[i].date).format("DD/MM/YYYY"),
                        hour: moment(data[i].date).format("HH:mm"),
                        id: data[i]._id,
                        dock: data[i].dock,
                        name: data[i].name,
                        vehiclePlate: data[i].vehiclePlate,
                        phone: data[i].phone,
                    }
                }
                res.render("admin/historic", { viewData: viewData })
            }).catch((err) => {
                req.flash("error_msg", "Não foi possível localizar os dados")
                res.redirect("/")
            })
    } else {
        req.flash("error_msg", "Você não tem permissão para acessar essa página")
        res.redirect("/")
    }

})




module.exports = router