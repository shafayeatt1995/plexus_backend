const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();
const { checkoutSession } = require("../controllers/PurchaseController");

router.use("/auth", require("./auth"));

router.use(isAuthenticated);
router.use("/user", require("./user"));
router.post("/checkout-session", checkoutSession);

module.exports = router;
