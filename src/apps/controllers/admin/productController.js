const mongoose = require('mongoose');
const products = mongoose.model('Product');
const categories = mongoose.model('Category');
const fs = require('fs');
const path = require('path');
const joi = require('@hapi/joi');

module.exports.product = async function(req, res) {
    const totalProducts = await products.find().countDocuments();
    const limit = 2;
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

    const allProducts = await products.find().populate('cat_id').sort("-_id").limit(limit).skip(skip);
    console.log(allProducts[0]);
    // nếu chỉ muốn lấy ra tên danh mục 
    // const allProducts = await products.find().populate({
    //     path: 'cat_id',
    //     select: 'cat_name',

    // });
    //in ra params
    // console.log(req.params);
    // in ra query
    res.render('admin/pages/product/product', { products: allProducts, categories, page, range, totalPages });
}

module.exports.addProduct = async function(req, res) {
    const allCategories = await categories.find()
    res.render('admin/pages/product/addProduct', { categories: allCategories });
}

module.exports.storeProduct = async function(req, res) {
    const file = req.file;
    const bodySchema = joi.object({
        prd_name: joi.string().required(),
        prd_price: joi.number()
    }).unknown();

    const value = await bodySchema.validateAsync(req.body).catch((err) => err);
    if (value instanceof Error) {
        return res.redirect('/admin/add-product')
    }
    console.log(value);
    console.log(file)
        //láy đường dẫn mong muốn, ở đây là folder img trong public/admin
    const uploadPath = path.resolve("src", "public", "admin", "img");
    //đọc file đc upload
    const contentFile = fs.readFileSync(file.path);
    fs.unlinkSync(file.path);

    fs.writeFileSync(path.join(uploadPath, file.originalname), contentFile);

    const p = new products({
        prd_name: value.prd_name,
        cat_id: value.cat_id,
        prd_image: file.originalname,
        prd_price: value.prd_price,
        prd_warranty: value.prd_warranty,
        prd_accessories: value.prd_accessories,
        prd_new: value.prd_new,
        prd_promotion: value.prd_promotion,
        prd_status: value.prd_status,
        prd_featured: value.prd_featured,
        prd_details: value.prd_details
    })

    await p.save();
    return res.redirect('/admin/product')
}

module.exports.destroyProduct = async function(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(id)
        return res.redirect('/admin/product')
    }
    const p = await products.findByIdAndDelete(id);
    if (p) {
        const uploadPath = path.resolve("src", "public", "admin", "img");
        if (fs.existsSync(path.join(uploadPath, p.prd_image))) {
            fs.unlink(path.join(uploadPath, p.prd_image))
        }
    }
    console.log(p)
    return res.redirect('/admin/product')
}

module.exports.updateProduct = async function(req, res) {
    const allCategories = await categories.find();
    const { id } = req.params;
    const product = await products.findById(id);
    res.render('admin/pages/product/updateproduct', { categories: allCategories, product: product });
}

module.exports.postUpdateProduct = async function(req, res) {
    const { id } = req.params;
    const file = req.file;
    if (file) {
        //láy đường dẫn mong muốn, ở đây là folder img trong public/admin
        const uploadPath = path.resolve("src", "public", "admin", "img");
        //đọc file đc upload
        const contentFile = fs.readFileSync(file.path);
        fs.unlinkSync(file.path);

        fs.writeFileSync(path.join(uploadPath, file.originalname), contentFile);
    }

    const bodySchema = joi.object({
        prd_name: joi.string().required(),
        prd_price: joi.number()
    }).unknown();
    const value = await bodySchema.validateAsync(req.body).catch((err) => err);
    if (value instanceof Error) {
        return res.redirect('/admin/add-product')
    }

    const productUpdate = {
        prd_name: value.prd_name,
        cat_id: value.cat_id,
        prd_price: value.prd_price,
        prd_warranty: value.prd_warranty,
        prd_accessories: value.prd_accessories,
        prd_new: value.prd_new,
        prd_promotion: value.prd_promotion,
        prd_status: value.prd_status,
        prd_featured: value.prd_featured,
        prd_details: value.prd_details
    }
    if (file) {
        productUpdate['prd_name'] = file.originalname;
    }

    await products.updateOne({ _id: id }, {
        $set: productUpdate
    })
    return res.redirect('/admin/product')
}