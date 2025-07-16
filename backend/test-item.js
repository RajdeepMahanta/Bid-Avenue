const mongoose = require("mongoose");
const Item = require("./models/Item");

const testItem = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://bvishu:auction123@auction.1w5e7xu.mongodb.net/OAS"
    );
    console.log("Database Connected");

    // Create a test item with image
    const testItem = new Item({
      title: "Test Item with Image",
      description: "This is a test item to check if image field works",
      startingBid: 100,
      currentBid: 100,
      auctionEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      image: "https://via.placeholder.com/400x200/0000FF/FFFFFF?text=Test+Image"
    });

    await testItem.save();
    console.log("Test item created:", testItem);

    // Fetch all items to check structure
    const allItems = await Item.find();
    console.log("All items:", allItems);
    console.log("First item structure:", allItems[0]);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

testItem();
