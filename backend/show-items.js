const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bidavenue');

const Item = require('./models/Item');

async function showAllItems() {
  try {
    const items = await Item.find({});
    console.log(`Found ${items.length} items in database\n`);
    
    items.forEach((item, index) => {
      const isEnded = new Date(item.auctionEndTime) <= new Date();
      console.log(`${index + 1}. "${item.title}"`);
      console.log(`   Status: ${isEnded ? '🔴 ENDED' : '🟢 ACTIVE'}`);
      console.log(`   Current Bid: $${item.currentBid}`);
      console.log(`   Current Bidder: ${item.currentBidder || 'None'}`);
      console.log(`   Ends: ${item.auctionEndTime}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

showAllItems();
