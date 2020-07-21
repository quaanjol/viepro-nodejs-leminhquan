const mongoose = require('mongoose');
const categories = mongoose.model('Category');


module.exports.category = async function(req, res) {
    const allCategories = await categories.find().populate('product');
    console.log(allCategories);
    res.render('admin/pages/category', { categories: allCategories });
}