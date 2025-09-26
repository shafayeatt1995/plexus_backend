const express = require("express");
const { purchaseHistory } = require("../../controllers/PurchaseController");
const { summary, fetchSummary } = require("../../controllers/AIController");
const router = express.Router();

router.get("/purchase-history", purchaseHistory);
router.get("/summary", fetchSummary);
router.post("/summary", summary);

module.exports = router;
