const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const passport = require("passport")
const bodyParser = require("body-parser")
const validator = require("validator")
const moment = require("moment")
ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn, app = express();

require("../models/vehicleData")
const vehicleData = mongoose.model("vehicleData")
require("../models/users")
const user = mongoose.model("users")

function converteDataParaExibição(valor) {
    return moment(valor).format("DD/MM/YYYY")
}

function converteDataParaSalvar(valor) {
    return moment(valor, 'DD/MM/YYYY', true).format()
}

router.get("/", ensureLoggedIn("/users/login"), (req, res) => {

    let dock = req.query.dock
    let vehiclePlate = req.user.vehiclePlate

    let viewData = { dock: dock, vehiclePlate: vehiclePlate }
    res.render("vehicleData/index", { viewData: viewData })

})

router.post("/", ensureLoggedIn("/users/login"), (req, res) => {

    let date = moment()
    let name = req.body.name
    let dock = req.body.dock
    let vehiclePlate = req.body.vehiclePlate

    user.find({ cpf: req.user.cpf }).then((data) => {
        let phone = req.user.phone

        const newDataInsertion = new vehicleData({
            date: date,
            name: name,
            dock: dock,
            vehiclePlate: vehiclePlate,
            phone: phone
        })

        newDataInsertion.save().then(() => {
            res.redirect("vehicleData/confirmation")
        })
    }).catch((err) => {
        req.flash("error_msg", err)
        res.redirect("/vehicleData")
    })

})

router.get("/confirmation", ensureLoggedIn("/users/login"), (req, res) => {
    res.render("vehicleData/confirmation")
})

module.exports = router