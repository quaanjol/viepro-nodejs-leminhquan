const mongoose = require('mongoose');
const categories = mongoose.model('Category');
const { formatPrice } = require("../../libs/ulis");

module.exports = async function(req, res, next) {
    res.locals.menus = await categories.find();
    res.locals.miniCart = req.session.cart || [];
    res.locals.formatPrice = formatPrice;
    next();
}