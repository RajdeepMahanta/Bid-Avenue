const Item = require("../models/Item");

// Get all items
exports.getAllItems = (req, res) => {
  Item.find()
    .then((items) => {
      console.log("Items fetched:", items); // Log fetched items
      console.log("First item structure:", items[0]); // Log first item structure
      res.json(items);
    })
    .catch((err) => {
      console.error("Error fetching items:", err); // Log errors
      res.status(500).json({ error: err.message });
    });
};

// Create a new item
exports.createItem = async (req, res) => {
  const { title, description, startingBid, auctionEndTime, image } = req.body;

  console.log("Received data:", { title, description, startingBid, auctionEndTime, image }); // Debug log

  try {
    const newItem = new Item({
      title,
      description,
      startingBid,
      currentBid: startingBid,
      auctionEndTime,
      image,
    });

    console.log("Created item object:", newItem); // Debug log

    await newItem.save();
    console.log("Item saved successfully:", newItem); // Debug log
    res.status(201).json(newItem); // Respond with the newly created item
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: "Server error, failed to create item." });
  }
};

exports.biddingUpdate = async (req, res) => {
  const { id } = req.params;
  const { bidder, amount } = req.body;

  try {
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if auction has ended
    const now = new Date();
    const auctionEndTime = new Date(item.auctionEndTime);
    
    if (now >= auctionEndTime) {
      return res.status(400).json({ 
        message: "This auction has ended. No more bids can be placed.",
        auctionEnded: true 
      });
    }

    // Validate the new bid amount
    if (parseFloat(amount) <= parseFloat(item.currentBid)) {
      return res
        .status(400)
        .json({ message: "Bid amount must be higher than the current bid" });
    }

    // Update the item with the new bid and bidder
    item.currentBid = amount;
    item.currentBidder = bidder;

    await item.save();

    res.status(200).json({ message: "Bid updated successfully", item });
  } catch (err) {
    console.error("Error updating bid:", err);
    res.status(500).json({ error: err.message });
  }
};

// Existing getItemById function for reference
exports.getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update an item by ID
exports.updateItem = (req, res) => {
  const itemId = req.params.id;
  const { title, description, startingBid, auctionEndTime, image } = req.body;

  Item.findByIdAndUpdate(
    itemId,
    { title, description, startingBid, auctionEndTime, image },
    { new: true, runValidators: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Delete an item by ID
exports.deleteItem = (req, res) => {
  const itemId = req.params.id;

  Item.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

// Extend auction end time for all items (Admin only)
exports.extendAllAuctions = async (req, res) => {
  const { hours } = req.body;

  try {
    if (!hours || hours <= 0) {
      return res.status(400).json({ 
        error: "Please provide a valid number of hours to extend" 
      });
    }

    const hoursToAdd = parseInt(hours);
    const millisecondsToAdd = hoursToAdd * 60 * 60 * 1000;

    // Get all items
    const items = await Item.find({});
    
    if (items.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }

    // Update all items with extended auction end time
    const updatePromises = items.map(item => {
      const currentEndTime = new Date(item.auctionEndTime);
      const newEndTime = new Date(currentEndTime.getTime() + millisecondsToAdd);
      
      return Item.findByIdAndUpdate(
        item._id,
        { auctionEndTime: newEndTime },
        { new: true }
      );
    });

    const updatedItems = await Promise.all(updatePromises);

    res.status(200).json({
      message: `Successfully extended ${updatedItems.length} auctions by ${hoursToAdd} hours`,
      count: updatedItems.length,
      hoursExtended: hoursToAdd
    });

  } catch (err) {
    console.error("Error extending auctions:", err);
    res.status(500).json({ error: "Failed to extend auctions" });
  }
};

// Update specific auction end time (Admin only)
exports.updateAuctionEndTime = async (req, res) => {
  const { id } = req.params;
  const { auctionEndTime } = req.body;

  try {
    if (!auctionEndTime) {
      return res.status(400).json({ 
        error: "Please provide a valid auction end time" 
      });
    }

    const newEndTime = new Date(auctionEndTime);
    const now = new Date();

    // Validate that the new end time is in the future
    if (newEndTime <= now) {
      return res.status(400).json({ 
        error: "Auction end time must be in the future" 
      });
    }

    const item = await Item.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update the auction end time
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { auctionEndTime: newEndTime },
      { new: true }
    );

    res.status(200).json({
      message: `Successfully updated auction end time for "${updatedItem.title}"`,
      item: updatedItem
    });

  } catch (err) {
    console.error("Error updating auction end time:", err);
    res.status(500).json({ error: "Failed to update auction end time" });
  }
};
