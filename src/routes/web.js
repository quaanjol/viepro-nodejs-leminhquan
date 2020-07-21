const { Router } = require('express');
const clientController = require('../apps/controllers/client/clientController');
const adminController = require('../apps/controllers/adminController');
const dashboard = require('../apps/controllers/admin/index');
const productController = require('../apps/controllers/admin/productController');
const logController = require('../apps/controllers/admin/logController');
const categoryController = require('../apps/controllers/admin/categoryController');
const path = require('path');
const router = Router();
const multer = require('multer');
const checkLogin = require('../apps/middlewares/checkLogin');
const checkLogout = require('../apps/middlewares/checkLogout');
const { getComment } = require('../apps/controllers/ajax/getComment');
const ajax = require('../apps/controllers/ajax/getComment');
const adminAjax = require('../apps/controllers/ajax/getAdminComment');
const commentController = require('../apps/controllers/admin/commentController');
const ajaxUpdateCart = require('../apps/controllers/ajax/updateCart');


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/private/tmp')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
const upload = multer({ storage: storage });


router.get('/form', function(req, res) {
    res.render("test/form", { username: "user" });
})

router.post("/form", function(req, res) {
    console.log(req.body.username);
    res.render("test/form", { username: req.body.username });
})


//login
router.get('/admin/login', checkLogin, logController.login);
router.post('/admin/login', checkLogin, logController.postLogin);

//admin
router.use("/admin", checkLogout);
// router.use("/admin/dashboard", checkLogout);
router.get('/admin/logout', logController.logout);

//nếu có hai phưuong thức dùng chung 1 route, có thể viết như sau:
// router.route('/admin/login').get(logController.login).post(logController.postLogin);

//

router.get('/admin/dashboard', adminController.dashboard.dashboard);
router.get('/admin/product', productController.product);
router.get('/admin/product/add', productController.addProduct);
router.post('/admin/product/add', upload.single('prd_image'), productController.storeProduct);
router.get('/admin/delete-product/:id', productController.destroyProduct);
router
    .route('/admin/product/edit/:id')
    .get(productController.updateProduct)
    .post(upload.single('prd_image'), productController.postUpdateProduct)

router.get('/admin/category', categoryController.category);
router.get('/admin/comments', commentController.getComments);
router.post("/ajax/get-admin-comment", adminAjax.getAdminComment);


// router.get("/admin/product/:productId", productController.product);

// client
router.get("/", clientController.login);
router.get("/category-:name-:id", clientController.category);
router.get("/product-detail-:id", clientController.productDetail);
router.post("/product-detail-:id/comment", clientController.postComment);
router.get("/cart", clientController.cart);
router.post("/add-to-cart", clientController.addToCart);
router.post("/update-cart", clientController.updateCart);
router.post("/ajax/get-product-comment", ajax.getComment);
router.post("/ajax-update-cart", ajaxUpdateCart.updateCart);
router.post("/ajax-delete-cart", ajaxUpdateCart.deleteCart);
router.get("/search", clientController.search);

router.get("/error", async function(req, res, next) {
    // console.log(a);
    try {
        throw new Error("a: not valid");
    } catch (error) {
        next(error);
    }
})

module.exports = router;