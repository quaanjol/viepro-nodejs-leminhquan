const ejs = require('ejs');
const path = require('path');

const format = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
})

exports.formatPrice = (num) => {
    return format.format(num);
}