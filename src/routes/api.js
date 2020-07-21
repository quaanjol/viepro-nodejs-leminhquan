const { Router } = require('express');

const router = Router();

router.get("/", function(req, res) {
    res.json({
        success: true,
        respone: "hello"
    })
})

module.exports = router;