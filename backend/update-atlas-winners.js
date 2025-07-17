const mongoose = require('mongoose');

async function updateAtlasDatabase() {
  try {
    console.log('Connecting to Atlas database...');
    await mongoose.connect('mongodb+srv://bvishu:auction123@auction.1w5e7xu.mongodb.net/OAS');
    console.log('Connected successfully!');

    const Item = require('./models/Item');
    
    // Get all items from Atlas
    const items = await Item.find({});
    console.log(`Found ${items.length} items in Atlas database\n`);
    
    if (items.length === 0) {
      console.log('No items found in Atlas database. The items might be in your local database instead.');
      process.exit(0);
    }

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
      
      console.log(`Checking: "${item.title}" - Status: ${isEnded ? 'ENDED' : 'ACTIVE'} - Current Bidder: ${item.currentBidder || 'None'}`);
      
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
        // Replace existing winner with a new random one
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
        
        await Item.findByIdAndUpdate(item._id, {
          currentBidder: randomName
        });
        
        console.log(`✅ Updated "${item.title}": New Winner = ${randomName}, Bid = $${item.currentBid}`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} auctions with random winners in Atlas!`);
    console.log('Refresh your frontend to see the winners!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateAtlasDatabase();
