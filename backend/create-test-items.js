const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bidavenue');

const Item = require('./models/Item');

async function createTestItems() {
  try {
    // Clear existing items for fresh start
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Create test items
    const testItems = [
      {
        title: "Vintage Watch",
        description: "A beautiful vintage watch from the 1950s",
        startingBid: 100,
        currentBid: 250,
        currentBidder: "Alice Johnson",
        auctionEndTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Ended 2 hours ago
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
      },
      {
        title: "Modern Laptop",
        description: "High-performance laptop for gaming and work",
        startingBid: 500,
        currentBid: 750,
        currentBidder: "Bob Smith",
        auctionEndTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // Ended 1 hour ago
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
      },
      {
        title: "Smartphone",
        description: "Latest model smartphone with all features",
        startingBid: 300,
        currentBid: 450,
        currentBidder: "Carol Davis",
        auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Ends in 2 hours (active)
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
      },
      {
        title: "Antique Vase",
        description: "Rare antique vase from Ming dynasty",
        startingBid: 1000,
        currentBid: 1500,
        currentBidder: "David Wilson",
        auctionEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // Ends in 4 hours (active)
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
      },
      {
        title: "Gaming Console",
        description: "Next-gen gaming console with accessories",
        startingBid: 400,
        currentBid: 650,
        currentBidder: "Emma Brown",
        auctionEndTime: new Date(Date.now() - 30 * 60 * 1000), // Ended 30 minutes ago
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400"
      }
    ];

    const createdItems = await Item.insertMany(testItems);
    
    console.log(`Created ${createdItems.length} test items:`);
    createdItems.forEach(item => {
      const isEnded = new Date(item.auctionEndTime) <= new Date();
      console.log(`- ${item.title}: ${isEnded ? 'ENDED' : 'ACTIVE'} - Winner/Leader: ${item.currentBidder}`);
    });

    console.log('\nTest items created successfully!');
    console.log('You should now see:');
    console.log('- 3 ENDED auctions with winners: Alice Johnson, Bob Smith, Emma Brown');
    console.log('- 2 ACTIVE auctions with current leaders: Carol Davis, David Wilson');
    console.log('\nRefresh your frontend to see the winner displays!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createTestItems();
