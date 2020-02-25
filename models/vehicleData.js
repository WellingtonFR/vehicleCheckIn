const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VehicleData = new Schema({

    date: {
        type: Date,
        required: true
    },
    name: {
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
    phone: {
        type: String,
        required: true
    },
    isChecked: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

mongoose.model("vehicleData", VehicleData)