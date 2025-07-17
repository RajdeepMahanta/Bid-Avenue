const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bidavenue');

const Item = require('./models/Item');

async function replaceWinnersWithRandomNames() {
  try {
    const items = await Item.find({});
    console.log(`Found ${items.length} items in database\n`);
    
    // Array of random winner names
    const randomNames = [
      'Sarah Wilson', 'Michael Chen', 'Emma Thompson', 'David Rodriguez', 'Lisa Anderson',
      'James Miller', 'Maria Garcia', 'Robert Johnson', 'Jennifer Lee', 'Christopher Davis',
      'Amanda Taylor', 'Daniel Brown', 'Jessica Martinez', 'Matthew Wilson', 'Ashley Moore',
      'Oliver Jackson', 'Sophia White', 'Ethan Harris', 'Isabella Clark', 'Mason Lewis'
    ];

    let updatedCount = 0;

    for (const item of items) {
      const isEnded = new Date(item.auctionEndTime) <= new Date();
      
      if (isEnded) {
        // This auction has ended - give it a random winner
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
        // Keep the existing winning bid or create a reasonable one
        const winningBid = item.currentBid || (item.startingBid + Math.floor(Math.random() * 200) + 50);
        
        await Item.findByIdAndUpdate(item._id, {
          currentBidder: randomName,
          currentBid: winningBid
        });
        
        console.log(`✅ Updated "${item.title}": Winner = ${randomName}, Winning Bid = $${winningBid}`);
        updatedCount++;
      } else {
        console.log(`⏰ "${item.title}": Still active - keeping current leader "${item.currentBidder || 'None'}"`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} ended auctions with random winners!`);
    console.log('Refresh your frontend to see the new winners!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

replaceWinnersWithRandomNames();
