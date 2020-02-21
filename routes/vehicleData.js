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

function converteDataParaExibição(valor) {
    return moment(valor).format("DD/MM/YYYY")
}

function converteDataParaSalvar(valor) {
    return moment(valor, 'DD/MM/YYYY', true).format()
}

router.get("/:dock", ensureLoggedIn("/users/login"),(req, res) => {
    let dock = req.query.dock
    let viewData = { dock: dock }
    res.render("vehicleData/index", { viewData: viewData })
})

router.post("/", ensureLoggedIn("/users/login"),(req, res) => {
    var erros = []

    let date = date.now()
    let name = req.body.name
    let vehiclePlate = req.body.vehiclePlate
    let dock = req.query.dock
    let group = req.body.group

    if (!date || date == null || date == undefined) {
        erros.push({ message: "O campo data deve ser preenchido" })
    } else if (date.length > 10) {
        erros.push({ message: "Formato de data inválido" })
    } else if (verifyDate(date)) {
        erros.push({ message: "A data não deve ser posterior a hoje" })
    }

    if (!type || type == null || type == undefined) {
        erros.push({ message: "O campo tipo deve ser preenchido" })
    } else if (validator.isNumeric(type)) {
        erros.push({ message: "Valor preenchido no campo tipo é inválido" })
    }

    if (!identification || identification == null || identification == undefined) {
        erros.push({ message: "O campo identificação deve ser preenchido" })
    }

    if (!value || value == null || value == undefined) {
        erros.push({ message: "O campo valor deve ser preenchido" })
    } else if (value.length > 14) {
        erros.push({ message: "Número de caracteres excedido no campo valor" })
    }

    if (!group || group == null || group == undefined) {
        erros.push({ message: "O campo classificação deve ser preenchido" })
    } else if (validator.isNumeric(group)) {
        erros.push({ message: "O campo classificação deve conter apenas letras" })
    }

    if (erros.length > 0) {
        var formData = { date: date, type: type, identification: identification, value: value, group: group }
        res.render("financialData/insertNewData", { erros: erros, formData: formData })
    } else {

        //modifica o value para decimal
        value = converteValorParaSalvar(value)
        //modifica a data para o padrão UTC
        date = converteDataParaSalvar(date)

        const newDataInsertion = new financialData({
            date: date,
            type: type,
            identification: identification,
            value: value,
            group: group,
            user: req.user.email
        })

        newDataInsertion.save().then(() => {
            res.redirect("/financialData")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar o dados")
            res.redirect("/financialData/insertNewData")
        })

    }

})

router.get("/viewAllFinancialData", ensureLoggedIn("/users/login"), (req, res) => {

    financialData
        .find()
        .where({ user: req.user.email })
        .sort({ createdAt: -1 })
        .then((data) => {

            for (let i = 0; i < data.length; i++) {
                data[i].value = converteValorParaExibição(data[i].value)
                data[i].date = converteDataParaExibição(data[i].date)
            }

            res.render("financialData/viewAllFinancialData", { data: data })
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao carregar os dados")
            res.redirect("/financialData/insertNewData")
        })
})

module.exports = router