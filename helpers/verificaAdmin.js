module.exports = {
    verificaAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.verificaAdmin == 1) {
            return next()
        }
        req.flash("error_msg", "Você deve ser um administrador para acessar")
        res.redirect("/")
    }
}