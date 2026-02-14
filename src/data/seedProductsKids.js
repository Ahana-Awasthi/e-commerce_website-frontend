const mongoose = require('mongoose');
const Product = require('./models/product'); // import Product model

const mongoURI = 'mongodb+srv://AHANAAWASTHI-MERN:MERN-Cluster!2802@mern-projects.rzxtk1k.mongodb.net/ecommerceDB?retryWrites=true&w=majority&appName=MERN-projects';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

function calculateDiscountedPrice(originalPrice, discount) {
    return Math.round(originalPrice - (originalPrice * discount / 100));
}
const KidsProducts = [
  { name: "Kids Casual T-Shirt", description: "Comfortable cotton t-shirt for kids", category: "Kids", subCategory: "T-Shirt", originalPrice: 499, discount: "20%", price: 399, imageUrl: "https://i.postimg.cc/YvJBPsMB/kid1.png", inStock: true },
  { name: "Kids Denim Shorts", description: "Durable denim shorts for everyday wear", category: "Kids", subCategory: "Shorts", originalPrice: 699, discount: "15%", price: 594, imageUrl: "https://i.postimg.cc/fV6QPrDs/kid2.png", inStock: false },
  { name: "Kids Hoodie", description: "Warm hoodie with front pocket", category: "Kids", subCategory: "Hoodie", originalPrice: 799, discount: "25%", price: 599, imageUrl: "https://i.postimg.cc/21PNtKrD/kid3.png", inStock: true },
  { name: "Kids Joggers", description: "Soft joggers for playtime and comfort", category: "Kids", subCategory: "Joggers", originalPrice: 599, discount: "10%", price: 539, imageUrl: "https://i.postimg.cc/v4pwKNbG/kid4.png", inStock: true },
  { name: "Kids School Shirt", description: "Formal school shirt for daily wear", category: "Kids", subCategory: "Shirts", originalPrice: 449, discount: "0%", price: 449, imageUrl: "https://i.postimg.cc/K1dhWHxG/kid5.png", inStock: false },
  { name: "Kids Party Dress", description: "Colorful party dress for girls", category: "Kids", subCategory: "Dress", originalPrice: 899, discount: "20%", price: 719, imageUrl: "https://i.postimg.cc/K1dhWHxc/kid6.png", inStock: true },
  { name: "Kids Summer Cap", description: "Lightweight cotton cap for sunny days", category: "Kids", subCategory: "Cap", originalPrice: 199, discount: "10%", price: 179, imageUrl: "https://i.postimg.cc/dhzcfxw0/kid7.png", inStock: true },
  { name: "Kids Sneakers", description: "Durable and comfy sneakers for kids", category: "Kids", subCategory: "Shoes", originalPrice: 1299, discount: "15%", price: 1104, imageUrl: "https://i.postimg.cc/cvVGzb0C/kid8.png", inStock: false },
  { name: "Kids Winter Jacket", description: "Warm jacket for winter season", category: "Kids", subCategory: "Jacket", originalPrice: 1499, discount: "25%", price: 1124, imageUrl: "https://i.postimg.cc/PCBn7RTN/kid9.png", inStock: true },
  { name: "Kids Socks Pack", description: "Pack of 5 cotton socks", category: "Kids", subCategory: "Socks", originalPrice: 299, discount: "10%", price: 269, imageUrl: "https://i.postimg.cc/d7rccjVY/kid10.png", inStock: true },
  { name: "Kids Swimwear", description: "Comfortable swimwear for kids", category: "Kids", subCategory: "Swimwear", originalPrice: 799, discount: "20%", price: 639, imageUrl: "https://i.postimg.cc/XZd66kY3/kid11.png", inStock: false },
  { name: "Kids Leggings", description: "Stretchy leggings for daily use", category: "Kids", subCategory: "Leggings", originalPrice: 499, discount: "15%", price: 424, imageUrl: "https://i.postimg.cc/7C0rrnZq/kid12.png", inStock: true },
  { name: "Kids Winter Gloves", description: "Warm gloves for winter", category: "Kids", subCategory: "Gloves", originalPrice: 299, discount: "10%", price: 269, imageUrl: "https://i.postimg.cc/xkMVV31n/kid13.png", inStock: true },
  { name: "Kids Raincoat", description: "Waterproof raincoat for rainy days", category: "Kids", subCategory: "Raincoat", originalPrice: 799, discount: "20%", price: 639, imageUrl: "https://i.postimg.cc/PLYnnQ5t/kid14.png", inStock: false },
  { name: "Kids Pajama Set", description: "Comfortable sleepwear set", category: "Kids", subCategory: "Pajama", originalPrice: 699, discount: "15%", price: 594, imageUrl: "https://i.postimg.cc/1gw11r35/kid15.png", inStock: true },
  { name: "Kids Sandals", description: "Lightweight sandals for summer", category: "Kids", subCategory: "Shoes", originalPrice: 599, discount: "10%", price: 539, imageUrl: "https://i.postimg.cc/QB1ZZJdd/kid16.webp", inStock: true },
  { name: "Kids Frock", description: "Pretty frock for girls", category: "Kids", subCategory: "Dress", originalPrice: 799, discount: "20%", price: 639, imageUrl: "https://i.postimg.cc/7C0rrnZ6/kid17.webp", inStock: false },
  { name: "Kids Backpack", description: "Durable backpack for school", category: "Kids", subCategory: "Bags", originalPrice: 999, discount: "15%", price: 849, imageUrl: "https://i.postimg.cc/p9zMMJLd/kid18.webp", inStock: true },
  { name: "Kids Capris", description: "Comfortable capris for girls", category: "Kids", subCategory: "Capris", originalPrice: 499, discount: "10%", price: 449, imageUrl: "https://i.postimg.cc/4KVRRQxy/kid19.png", inStock: true },
  { name: "Kids Sports T-Shirt", description: "Lightweight sports t-shirt", category: "Kids", subCategory: "T-Shirt", originalPrice: 399, discount: "0%", price: 399, imageUrl: "https://i.postimg.cc/qtyHHxvg/kid20.png", inStock: false },
  { name: "Kids Winter Cap", description: "Warm winter cap", category: "Kids", subCategory: "Cap", originalPrice: 299, discount: "10%", price: 269, imageUrl: "https://i.postimg.cc/kVKPPvg2/kid21.png", inStock: true },
  { name: "Kids Party Shoes", description: "Fancy shoes for parties", category: "Kids", subCategory: "Shoes", originalPrice: 1299, discount: "20%", price: 1039, imageUrl: "https://i.postimg.cc/LqLFF38Y/kid22.png", inStock: true },
  { name: "Kids Hoodie Dress", description: "Hoodie styled dress", category: "Kids", subCategory: "Dress", originalPrice: 899, discount: "15%", price: 764, imageUrl: "https://i.postimg.cc/3ymQQFxp/kid23.png", inStock: false },
  { name: "Kids Jogging Shorts", description: "Soft shorts for jogging", category: "Kids", subCategory: "Shorts", originalPrice: 499, discount: "10%", price: 449, imageUrl: "https://i.postimg.cc/GBGnnxmD/kid24.png", inStock: true },
  { name: "Kids Tank Top", description: "Cotton tank top", category: "Kids", subCategory: "T-Shirt", originalPrice: 299, discount: "0%", price: 299, imageUrl: "https://i.postimg.cc/VSnPPWkX/kid25.png", inStock: true },
  { name: "Kids Sweatshirt", description: "Warm sweatshirt for cold weather", category: "Kids", subCategory: "Sweatshirt", originalPrice: 699, discount: "20%", price: 559, imageUrl: "https://i.postimg.cc/rdx22Nw1/kid26.png", inStock: false },
  { name: "Kids Shorts Set", description: "Matching shorts and t-shirt set", category: "Kids", subCategory: "Set", originalPrice: 799, discount: "15%", price: 679, imageUrl: "https://i.postimg.cc/nsBffGhK/kid27.png", inStock: true },
  { name: "Kids Swim Trunks", description: "Swim trunks for boys", category: "Kids", subCategory: "Swimwear", originalPrice: 599, discount: "10%", price: 539, imageUrl: "https://i.postimg.cc/67nxxfpL/kid28.png", inStock: true },
  { name: "Kids Ankle Socks", description: "Pack of 5 ankle socks", category: "Kids", subCategory: "Socks", originalPrice: 199, discount: "0%", price: 199, imageUrl: "https://i.postimg.cc/HJX119k2/kid29.png", inStock: false },
  { name: "Kids Cap Set", description: "Pack of colorful caps", category: "Kids", subCategory: "Cap", originalPrice: 299, discount: "10%", price: 269, imageUrl: "https://i.postimg.cc/f3mQQfRf/kid30.png", inStock: true },
  { name: "Kids Fleece Jacket", description: "Soft fleece jacket for winter", category: "Kids", subCategory: "Jacket", originalPrice: 999, discount: "20%", price: 799, imageUrl: "https://i.postimg.cc/8JGQpf7r/kid31.png", inStock: true },
  { name: "Kids Tutu Dress", description: "Cute tutu dress for girls", category: "Kids", subCategory: "Dress", originalPrice: 899, discount: "15%", price: 764, imageUrl: "https://i.postimg.cc/tZbQqns6/kid32.png", inStock: false },
  { name: "Kids Sport Shoes", description: "Shoes for outdoor activities", category: "Kids", subCategory: "Shoes", originalPrice: 1299, discount: "10%", price: 1169, imageUrl: "https://i.postimg.cc/Fdv5rkYc/kid33.png", inStock: true },
  { name: "Kids Lounge Set", description: "Comfortable lounge wear set", category: "Kids", subCategory: "Set", originalPrice: 799, discount: "20%", price: 639, imageUrl: "https://i.postimg.cc/dkFPsZh2/kid34.png", inStock: true },
  { name: "Kids Rain Boots", description: "Waterproof rain boots", category: "Kids", subCategory: "Shoes", originalPrice: 799, discount: "15%", price: 679, imageUrl: "https://i.postimg.cc/34h580kg/kid35.png", inStock: false },
  { name: "Kids Denim Jacket", description: "Stylish denim jacket", category: "Kids", subCategory: "Jacket", originalPrice: 999, discount: "20%", price: 799, imageUrl: "https://i.postimg.cc/R6m5SJWL/kid36.png", inStock: true },
  { name: "Kids Long Sleeve Tee", description: "Cotton long sleeve t-shirt", category: "Kids", subCategory: "T-Shirt", originalPrice: 499, discount: "10%", price: 449, imageUrl: "https://i.postimg.cc/7G48HJ59/kid37.png", inStock: true },
  { name: "Kids Floral Dress", description: "Floral print dress for girls", category: "Kids", subCategory: "Dress", originalPrice: 899, discount: "15%", price: 764, imageUrl: "https://i.postimg.cc/47GkfHYw/kid38.png", inStock: false },
  { name: "Kids Tracksuit", description: "Comfortable tracksuit for play", category: "Kids", subCategory: "Tracksuit", originalPrice: 799, discount: "10%", price: 719, imageUrl: "https://i.postimg.cc/PpHsXvC3/kid39.png", inStock: true },
  { name: "Kids Beanie", description: "Warm beanie for winter", category: "Kids", subCategory: "Cap", originalPrice: 299, discount: "0%", price: 299, imageUrl: "https://i.postimg.cc/v4pwKNbG/kid40.png", inStock: true },
  { name: "Kids Polo Shirt", description: "Casual polo shirt", category: "Kids", subCategory: "T-Shirt", originalPrice: 499, discount: "10%", price: 449, imageUrl: "https://i.postimg.cc/G8RwLT4N/kid41.png", inStock: false },
  { name: "Kids Gym Shorts", description: "Lightweight gym shorts", category: "Kids", subCategory: "Shorts", originalPrice: 399, discount: "0%", price: 399, imageUrl: "https://i.postimg.cc/wyz8qR1C/kid42.png", inStock: true },
  { name: "Kids Cardigan", description: "Soft knitted cardigan", category: "Kids", subCategory: "Sweater", originalPrice: 699, discount: "15%", price: 594, imageUrl: "https://i.postimg.cc/62KJW47s/kid43.png", inStock: true },
  { name: "Kids Capri Set", description: "Matching capri and top set", category: "Kids", subCategory: "Set", originalPrice: 699, discount: "10%", price: 629, imageUrl: "https://i.postimg.cc/cgWyxtKy/kid44.png", inStock: false },
  { name: "Kids Cotton Dress", description: "Soft cotton dress", category: "Kids", subCategory: "Dress", originalPrice: 799, discount: "15%", price: 679, imageUrl: "https://i.postimg.cc/xJQDfNk2/kid45.png", inStock: true },
  { name: "Kids Hoodie Sweatshirt", description: "Comfortable hoodie sweatshirt", category: "Kids", subCategory: "Hoodie", originalPrice: 699, discount: "10%", price: 629, imageUrl: "https://i.postimg.cc/k6yrBMSh/kid46.png", inStock: true },
  { name: "Kids Winter Pajama", description: "Warm pajama set", category: "Kids", subCategory: "Pajama", originalPrice: 599, discount: "10%", price: 539, imageUrl: "https://i.postimg.cc/k6yrBMSH/kid47.png", inStock: false },
  { name: "Kids Sports Cap", description: "Cap for outdoor sports", category: "Kids", subCategory: "Cap", originalPrice: 199, discount: "0%", price: 199, imageUrl: "https://i.postimg.cc/N9xh5GXz/kid48.png", inStock: true },
  { name: "Kids Sweatpants", description: "Comfortable sweatpants", category: "Kids", subCategory: "Pants", originalPrice: 599, discount: "10%", price: 539, imageUrl: "https://i.postimg.cc/VrFydst2/kid49.png", inStock: true },
  { name: "Kids Tank Dress", description: "Sleeveless tank dress", category: "Kids", subCategory: "Dress", originalPrice: 699, discount: "10%", price: 629, imageUrl: "https://i.postimg.cc/TLc8p2bF/kid50.png", inStock: false }
];


// Seed function
async function seedKidsProducts() {
    try {
await Product.deleteMany({ category: /Kids/i }); // ✅ deletes only kids' products
        await Product.insertMany(KidsProducts); // Insert new
        console.log('✅ Kids products seeded successfully');
    } catch (err) {
        console.error('❌ Error seeding kids products:', err);
    } finally {
        mongoose.connection.close();
    }
}

seedKidsProducts();
