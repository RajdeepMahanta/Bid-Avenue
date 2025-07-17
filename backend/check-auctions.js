const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bidavenue', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Item = require('./models/Item');

async function checkItems() {
  try {
    const items = await Item.find({});
    console.log('Current time:', new Date());
    console.log('\nItems in database:');
    items.forEach(item => {
      const endTime = new Date(item.auctionEndTime);
      const isEnded = endTime <= new Date();
      console.log(`- ${item.title}: Ends ${endTime}, Ended: ${isEnded}, Current Bidder: ${item.currentBidder || 'None'}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkItems();
