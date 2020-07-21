const mongoose = require('mongoose');
const { render } = require('ejs');
const comments = mongoose.model('Comment');
const ejs = require('ejs');
const path = require('path');

module.exports.getComment = async(req, res) => {
    const { id } = req.body;
    // const c = await comments.find({ prd_id: id });

    const page = parseInt(req.params.page || 1);
    const limit = 1;
    const totalDoc = await comments.find({ prd_id: id }).countDocuments();
    const totalPages = Math.ceil(totalDoc / limit);
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

    const c = await comments.find({ prd_id: id }).limit(limit).skip(skip);
    // trong thu muc app.set views
    const viewPath = req.app.get("views");

    const html = await ejs.renderFile(path.join(viewPath, "/site/component/product-comment.ejs"), { comments: c, totalPages: totalPages, range: range, totalDoc: totalDoc, page: page });

    // console.log(req.body);
    res.json({
        status: 'success',
        data: {
            html: html,
        }
    });
};