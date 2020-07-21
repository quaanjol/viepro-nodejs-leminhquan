var login = function(req, res) {
    // //truyền vào đường dẫn của file view, tính từ thư mục app
    // const a = [0, 1, 2];
    // res.render("test/test", { a });
    res.render("client/pages/home");
}

module.exports = { login };