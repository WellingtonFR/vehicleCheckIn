const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    vehiclePlate: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: 0
    }
}, { timestamps: true })

mongoose.model("users", User)
