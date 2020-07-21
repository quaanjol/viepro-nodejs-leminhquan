const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const products = mongoose.model('Product');
const categories = mongoose.model('Category');
const comments = mongoose.model('Comment');
const slug = require('slug');

var login = async function(req, res) {
    // //truyền vào đường dẫn của file view, tính từ thư mục app
    // const a = [0, 1, 2];
    // res.render("test/test", { a });
    const productFeatured = await products.find({ prd_featured: 1 }).limit(6).sort("-_id");
    const newProducts = await products.find({ prd_new: "Máy Mới 100%" }).limit(6).sort("-_id");
    res.render("client/pages/home", { productFeatured: productFeatured, newProducts: newProducts });
}

module.exports = { login };

module.exports.category = async function(req, res) {
    const { id, name } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new error("Invalid id");
    }

    const cate = await categories.findById(id);
    if (!cate) {
        throw new error("Invalid category");
    }

    const totalProducts = await products.find({ cat_id: id }).countDocuments();
    const limit = 6;
    const totalPages = Math.ceil(totalProducts / limit);
    let page;
    if (!req.query.page) {
        page = 1;
    } else {
        page = parseInt(req.query.page);
    }

    const skip = (page - 1) * limit;

    const range = [];
    const delta = 2;
    const left = page - delta;
    const right = page + delta;
    for (let i = 1; i <= totalPages; i++) {
        if (i == 1 || i == totalPages || (i >= left && i <= right)) {
            range.push(i);
        }
    }
    // console.log(range)

    const allProducts = await products.find({ cat_id: id }).sort("-_id").limit(limit).skip(skip);

    res.render("client/pages/category", { category: cate, allProducts: allProducts, totalProducts: totalProducts, page, range });
}

module.exports.productDetail = async function(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new error("Invalid id");
    }

    const p = await products.findById(id);
    if (!p) {
        throw Error("Invalid product");
    }
    res.render("client/pages/product", { product: p });
}

module.exports.postComment = async function(req, res) {
    try {
        const bodySchema = new Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            content: Joi.string().min(5).required()
        });

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw Error("Not valid ID");
        }

        const value = await bodySchema.validateAsync(req.body);

        if (value instanceof Error) {
            return res.redirect(`/product-detail-${id}`);
        }

        const comment = new comments({
            prd_id: id,
            content: value.content,
            info: {
                name: value.name,
                email: value.email
            }
        })

        await comment.save();
        return res.redirect(`/product-detail-${id}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports.addToCart = async function(req, res, next) {
    try {
        const bodySchema = Joi.object({
            quantity: Joi.number().required(),
            prd_id: Joi.string().required(),
            sbm: Joi.string().allow("Mua ngay", "Thêm vào giỏ hàng").required()
        });

        const value = await bodySchema.validateAsync(req.body);

        const sbm = slug(value.sbm, { lower: true });
        const product = await products.findOne({
            _id: value.prd_id,
            prd_status: true
        })

        if (!product) {
            return res.redirect("/");
        }

        let isUpdated = false;

        const oldCart = req.session.cart || [];

        const cart = oldCart.map((item) => {
            if (item._id == value.prd_id && !isUpdated) {
                item.qty += value.quantity;
                isUpdated = true;
            }
            return item;
        })

        if (!isUpdated) {
            cart.push({
                _id: value.prd_id,
                qty: value.quantity
            })
        }

        req.session.cart = cart;

        if (sbm == slug("Mua ngay")) {
            return res.redirect("/cart")
        } else if (sbm == slug("Thêm vào giỏ hàng")) {
            return res.redirect(`/product-detail-${value.prd_id}`);
        }

        console.log(sbm);

        console.log(req.body);


    } catch (err) {
        next(err);
    }
}

module.exports.cart = async function(req, res) {
    const cart = req.session.cart || [];

    const ids = cart.map(item => item._id);

    const productsInCart = await products.find({ _id: { $in: ids } });
    // console.log(productsInCart)

    res.render("client/pages/cart", { products: productsInCart });
}

module.exports.updateCart = async function(req, res, next) {
    try {

        const bodySchema = Joi.object({

        });

        const value = await bodySchema.validateAsync(req.body);
        return res.render("ok");
    } catch (err) {
        next(err);
    }
}

module.exports.search = async function(req, res, next) {
    try {
        const { q } = req.query;
        const p = await products.find({
                $text: {
                    $search: q || ""
                }
            })
            // console.log(p);

        res.render("client/pages/search", { products: p, q });
    } catch (err) {
        next(err);
    }
}