const mongoose = require("mongoose");

const categoryModel = new mongoose.Schema({
    cat_name: String
}, {
    toObject: {
        virtuals: true
    },
    toJson: {
        virtuals: true
    }
});

//cách 2 để liên kết table category vơi product
categoryModel.virtual('product', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'cat_id'
});

mongoose.model("Category", categoryModel, "category");
//tham số 1 là tên model, tham số 2 là lược đồ schema, tham số thứ 3 là tên của collection trong mongodb