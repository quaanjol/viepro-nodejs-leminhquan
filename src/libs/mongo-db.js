const mongoose = require('mongoose');
require('../apps/models/categoryModel');
require('../apps/models/productModel');
require('../apps/models/userModel');
require('../apps/models/commentModel');

const uris = "mongodb://127.0.0.1:27017/vietpro_shop";
// or const uris = "mongodb://localhost:27017"

mongoose.connect(uris);