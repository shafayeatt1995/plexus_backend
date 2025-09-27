const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();
const { fetchSummary, summary } = require("../controllers/AIController");

router.get("/", fetchSummary);

router.use(isAuthenticated);
router.post("/", summary);

module.exports = router;
