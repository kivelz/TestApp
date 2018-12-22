const Users = require('../models/user')


module.exports = {

    async getUsers(req, res, next) {
        let users = await Users.find({})
        let count = await Users.count({})
        res.render('admin/index', { users, count });
    },
    async removeUsers(req,res,next) {
        await Users.findByIdAndDelete(req.params.id);

        req.flash("success", "User successfully deleted from database");
        return res.redirect("/admin");
    }

}