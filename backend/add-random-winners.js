const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bidavenue');

const Item = require('./models/Item');

async function updateEndedAuctionsWithWinners() {
  try {
    // Get all items from the database
    const items = await Item.find({});
    console.log(`Found ${items.length} items in database\n`);
    
    // Array of random winner names
    const randomNames = [
      'Sarah Wilson', 'Michael Chen', 'Emma Thompson', 'David Rodriguez', 'Lisa Anderson',
      'James Miller', 'Maria Garcia', 'Robert Johnson', 'Jennifer Lee', 'Christopher Davis',
      'Amanda Taylor', 'Daniel Brown', 'Jessica Martinez', 'Matthew Wilson', 'Ashley Moore',
      'John Smith', 'Emily Johnson', 'Ryan Williams', 'Sophia Jones', 'Alexander Garcia'
    ];

    let updatedCount = 0;

    for (const item of items) {
      const isEnded = new Date(item.auctionEndTime) <= new Date();
      
      if (isEnded && !item.currentBidder) {
        // This auction has ended but has no winner - let's add one
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
        const winningBid = item.startingBid + Math.floor(Math.random() * 200) + 50; // Add $50-$250 to starting bid
        
        await Item.findByIdAndUpdate(item._id, {
          currentBidder: randomName,
          currentBid: winningBid
        });
        
        console.log(`✅ Updated "${item.title}": Winner = ${randomName}, Winning Bid = $${winningBid}`);
        updatedCount++;
      } else if (isEnded && item.currentBidder) {
        console.log(`📋 "${item.title}": Already has winner = ${item.currentBidder}`);
      } else {
        console.log(`⏰ "${item.title}": Still active (ends ${item.auctionEndTime})`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} ended auctions with random winners!`);
    console.log('Refresh your frontend to see the winners!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateEndedAuctionsWithWinners();
