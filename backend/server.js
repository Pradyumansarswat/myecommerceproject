const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
const sellerRoutes = require('./routes/sellerRoutes');
const variantRoutes = require('./routes/variantRoutes')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoriesRoute')
const cartRoutes = require('./routes/cartRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cors = require('cors');
const path = require('path');
dotenv.config();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002'], 
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGOURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userRoute);
app.use('/api/sellers', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/variants', variantRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
