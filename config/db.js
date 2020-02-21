if (process.env.NODE_ENV == "production") {
    module.exports = { mongoURI: "mongodb+srv://WellingtonFR:8eLYWr8rTkKw3DWj@cluster0-mkdnh.mongodb.net/test?retryWrites=true&w=majority" }
} else {
    module.exports = { mongoURI: "mongodb://localhost:32768/checkinvehicle" }
}