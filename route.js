const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Это только мой мир!");
});

module.exports = router;