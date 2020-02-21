const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VehicleData = new Schema({

    date: {
        type: String,
        required: true
    },
    dock: {
        type: String,
        required: true
    },
    vehiclePlate: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
}, { timestamps: true })

mongoose.model("vehicleData", VehicleData)