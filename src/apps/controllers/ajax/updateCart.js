const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Joi = require("@hapi/joi");
const products = mongoose.model('Product');

async function renderHTML(req, view, data) {
    const viewPath = req.app.get("views");
    const html = await ejs.renderFile(path.join(viewPath, view), data);
    return html;
}

module.exports.updateCart = async function(req, res) {
    const bodySchema = Joi.object({
        qty: Joi.number().required(),
        id: Joi.string().required()
    })

    const value = await bodySchema.validateAsync(req.body);

    const cart = req.session.cart || [];

    const { id, qty } = value;

    const newCart = cart.map(item => {
        if (item._id == id && qty >= 1) {
            item.qty = qty;
        }
        return item;
    });

    const ids = newCart.map(item => item._id);
    const productsInCart = await products.find({ _id: { $in: ids } });
    // console.log(productsInCart);

    const html = await renderHTML(req, "/site/component/update-cart.ejs", { products: productsInCart, miniCart: newCart });

    console.log(html);
    return res.json({
        status: "success",
        data: {
            html: html
        }
    })
}

module.exports.deleteCart = async function(req, res) {
    const bodySchema = Joi.object({
        id: Joi.string().required()
    })

    const value = await bodySchema.validateAsync(req.body);

    const cart = req.session.cart || [];

    const { id } = value;

    const newCart = cart.filter((item, index) => {
        return item._id !== id;
    });
    req.session.cart = newCart;

    const ids = newCart.map(item => item._id);
    const productsInCart = await products.find({ _id: { $in: ids } });
    // console.log(productsInCart);

    const html = await renderHTML(req, "/site/component/update-cart.ejs", { products: productsInCart, miniCart: newCart });

    // console.log(html);
    return res.json({
        status: "success",
        data: {
            html: html
        }
    })
}