# ShopEase E-Commerce App

Welcome to ShopEase, your go-to e-commerce app for a seamless shopping experience, efficient product management for sellers, and comprehensive control for administrators.

## Features

### Admin

#### Category Management:
- Add, update, and delete product categories.

#### Product Management:
- Review, approve, or reject seller-submitted products.
- Update product information and status.

#### Order Management:
- Monitor and update order statuses.

#### Review Management:
- View and moderate product reviews.

### Sellers

#### Product Management:
- Add new products for review by the admin.
- View and manage their listed products, including status updates.

#### Order Status Tracking:
- Monitor orders related to their products.

### Users

#### Account Management:
- User registration and login with secure authentication.
- Upload and update profile picture, name, email, and password.
- Forgot password and reset password functionality.

#### Product Browsing:
- Search products by name, category, or other filters.
- View products organized by categories.
- Add products to a wishlist.

#### Cart Management:
- Add products to the cart.
- Update product quantities in the cart.

#### Order Management:
- Place orders seamlessly.
- View order history filtered by date range, order ID, or status.

#### Address Management:
- Add, update, or delete saved addresses for easy checkout.

## Installation Guide

### Prerequisites
- Node.js (>= 14.x)
- npm (>= 6.x)
- MongoDB (>= 4.x)

### Clone the Repository
```bash
git clone https://github.com/Pradyumansarswat/myecommerceprojectadmin.git
cd myecommerceprojectadmin
```

### Install Dependencies
```bash
npm install
```

### Environment Configuration
Create a `.env` file in the root directory and add the following environment variables:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
```

### Run the Application
To start the development server:
```bash
npm run dev
```

### Build for Production
To build the application for production:
```bash
npm run build
```
