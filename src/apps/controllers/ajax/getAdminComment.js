const mongoose = require('mongoose');
const { render } = require('ejs');
const comments = mongoose.model('Comment');
const ejs = require('ejs');
const path = require('path');

module.exports.getAdminComment = async(req, res) => {
    const c = await comments.find().populate('prd_id');
    // trong thu muc app.set views
    const viewPath = req.app.get("views");

    const html = await ejs.renderFile(path.join(viewPath, "/site/component/admin-comment.ejs"), { comments: c });

    // console.log(c[0]);
    res.json({
        status: 'success',
        data: {
            html: html,
        }
    });
};