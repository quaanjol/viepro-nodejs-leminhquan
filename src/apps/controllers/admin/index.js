const mongoose = require('mongoose');

const categories = mongoose.model('Category');
const products = mongoose.model("Product");
const users = mongoose.model("User");
//làm việc với file 
const path = require('path');
const fs = require('fs');

module.exports.dashboard = async function(req, res) {
    // const categories = await category.find();
    // const products = await product.find();
    // console.log(categories);
    // console.log(products);
    // const cate = await category.findById("5ec3d3fd2a69e6c97cf528be");
    // console.log(cate);
    // const p = new product({
    //     cat_id: '5ec3d45b2a69e6c97cf528bf',
    //     name: "Samsung s10 Edge",
    //     price: '25000000',
    //     image: '',
    //     warranty: '1 years',
    //     accessories: 'Sách, sạc, tai nghe',
    //     new: "100%",
    //     promotion: "Discount 10%",
    //     status: 1,
    //     featured: 1,
    //     details: "Samsung chính hãng"
    // })
    // p.save();
    // console.log(p);
    // await product.update({ _id: "5ec684349c5579e4f96929c8" }, { price: "1000000000" });
    // await product.updateMany({ cat_id: "5ec3d45b2a69e6c97cf528bf" }, { warranty: "2 years" });
    // await product.updateMany({ _id: { $in: ['5ec684349c5579e4f96929c8', '5ec6870f63cc2be535cfca44'] } }, { warranty: "2 years" })

    // làm viẹc với fs
    //writeFile: ghi nội dung vào file, làm việc bất đồng bộ, tham số 1 là vị trí file, tham số 2 là nội dung, tham số 3 là callback func nhận tham số err
    // fs.writeFile(path.join(__dirname, "../../../", "storage", "test.txt"), 'test', (err) => {
    //     console.log("error:" + err);
    // })
    //readFile: tham số 1 là path, tham số 1 là option (k có cx đc), tham số 3 là callback
    // const data = fs.readFileSync(path.join(__dirname, "../../../", "storage", "test.txt"), (err, data) => {
    //     // console.log("data: " + data);
    // })
    // console.log(data);

    //xoá file: đồng bộ ko cần callback, xoá file bất đồng bộ cần callback
    // fs.unlinkSync(path.join(__dirname, "../../../", "storage", "test.txt"));

    res.render('admin/pages/dashboard');
}

function swap(a, b) {
    a += b; //15
    b = a - b; //10
    a -= b; //5
}