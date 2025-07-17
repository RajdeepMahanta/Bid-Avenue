const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// GET all items
router.get("/itemget", itemController.getAllItems);

// POST create a new item
router.post("/createItem", itemController.createItem);

router.get("/:id", itemController.getItemById);

// PUT update an item by ID
router.put("/:id/bid", itemController.biddingUpdate);

// DELETE delete an item by ID
router.delete("/:id", itemController.deleteItem);

// POST extend all auction times (Admin only)
router.post("/extend-auctions", itemController.extendAllAuctions);

module.exports = router;
