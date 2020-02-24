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
        vehicleData.find().then((data) => {
            let viewData = {}
            for (let i = 0; i < data.length; i++) {
                viewData[i] = {
                    day: moment(data[i].date).format("DD/MM/YYYY"),
                    hour: moment(data[i].date).format("HH:mm"),
                    dock: data[i].dock,
                    name: data[i].name,
                    vehiclePlate: data[i].vehiclePlate,
                    phone: data[i].phone,
                }
            }
            res.render("admin/index", { viewData: viewData })
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Não foi possível localizar os dados")
            res.redirect("/")
        })
    } else {
        req.flash("error_msg", "Você não tem permissão para acessar essa página")
        res.redirect("/")
    }
})

router.get("/filter", ensureLoggedIn("/users/login"), (req, res) => {

    let initialDate = req.query.initialDate
    let finalDate = req.query.finalDate

    vehicleData
        .find({ date: { $gte: initialDate, $lte: finalDate } })
        .then((data) => {
            let viewData = {}
            for (let i = 0; i < data.length; i++) {
                viewData[i] = {
                    day: moment(data[i].date).format("DD/MM/YYYY"),
                    hour: moment(data[i].date).format("HH:mm"),
                    dock: data[i].dock,
                    name: data[i].name,
                    vehiclePlate: data[i].vehiclePlate,
                    phone: data[i].phone,
                }
            }
            res.render("admin/index", { viewData: viewData })
        }).catch((err) => {
            req.flash("error_msg", "Não foi possível encontrar os dados")
            res.redirect("/index")
        })

})

module.exports = router