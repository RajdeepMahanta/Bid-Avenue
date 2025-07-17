const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bidavenue', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Item = require('./models/Item');

async function createTestEndedAuction() {
  try {
    // Get all items from the database
    const items = await Item.find({});
    
    console.log(`Found ${items.length} items in database`);
    
    if (items.length === 0) {
      console.log('No items found in database. Please create some items first.');
      process.exit(0);
    }

    // Show all items first
    console.log('\nAll items in database:');
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} - Current Bid: $${item.currentBid} - Bidder: ${item.currentBidder || 'None'}`);
    });

    const firstItem = items[0];
    console.log(`\nUpdating item: ${firstItem.title}`);
    
    // Set auction end time to 1 hour ago
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    // Update the item with ended auction and a winner
    const updatedItem = await Item.findByIdAndUpdate(firstItem._id, {
      auctionEndTime: oneHourAgo,
      currentBid: parseFloat(firstItem.startingBid) + 50, // Add $50 to starting bid
      currentBidder: 'John Doe' // Set a test winner
    }, { new: true });
    
    console.log(`\nSuccessfully updated ${updatedItem.title}:`);
    console.log(`- Auction end time set to: ${oneHourAgo}`);
    console.log(`- Current bid set to: $${updatedItem.currentBid}`);
    console.log(`- Winner set to: ${updatedItem.currentBidder}`);
    console.log('\nNow refresh your frontend to see the winner display!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createTestEndedAuction();
