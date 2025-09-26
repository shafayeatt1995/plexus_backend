const express = require("express");
const { purchaseHistory } = require("../../controllers/PurchaseController");
const router = express.Router();

router.get("/purchase-history", purchaseHistory);

module.exports = router;
