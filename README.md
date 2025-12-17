# 🛍️ ShopLite - Modern E-Commerce Platform

<div align="center">

![ShopLite](https://img.shields.io/badge/ShopLite-E--Commerce-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-ISC-orange?style=for-the-badge)

A full-stack e-commerce application built with the MERN stack, featuring a modern UI, secure authentication, and comprehensive shopping functionality.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛒 Customer Features
- **Product Browsing**: Browse products with categories (Electronics, Fashion, Home, Sports, Books, Food)
- **Product Details**: View detailed product information with images and pricing
- **Shopping Cart**: Add, update, and remove items from cart with real-time total calculation
- **User Authentication**: Secure registration and login system with JWT tokens
- **Order Management**: Place orders and view order history
- **User Profile**: Manage personal information and address details
- **Responsive Design**: Fully responsive UI built with Tailwind CSS

### 🔐 Admin Features
- **Admin Dashboard**: Comprehensive dashboard for managing the store
- **Product Management**: Add, edit, and delete products
- **Inventory Control**: Track and manage product stock levels
- **Order Tracking**: View and manage customer orders
- **User Management**: Admin role-based access control

### 🎨 UI/UX Features
- **Loading States**: Skeleton loaders for better user experience
- **Error Handling**: Global error boundary and custom error messages
- **Toast Notifications**: Real-time feedback for user actions
- **Protected Routes**: Client-side route protection for authenticated users
- **Modern Design**: Clean and intuitive interface with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Toastify** - Toast notifications
- **Vite** - Next-generation frontend tooling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart server during development
- **Morgan** - HTTP request logger
- **Cookie Parser** - Parse HTTP cookies
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

---

## 📁 Project Structure

```
SHOPLITE/
├── backend/                    # Backend application
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Route controllers
│   │   ├── authController.js  # Authentication logic
│   │   ├── cartController.js  # Cart operations
│   │   ├── orderController.js # Order management
│   │   └── productController.js # Product CRUD
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/                # Mongoose models
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/                  # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Images and static files
│   │   ├── components/       # Reusable components
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── LoadingButton.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SkeletonLoader.jsx
│   │   ├── context/          # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── hooks/            # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── pages/            # Page components
│   │   │   ├── AddProduct.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── utils/            # Utility functions
│   │   │   ├── api.js        # API client
│   │   │   └── toast.js      # Toast helpers
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Clone the Repository
```bash
git clone https://github.com/Sumanpradhan1706/SHOPLITE.git
cd SHOPLITE
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will run on `http://localhost:5173`

### Build for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🔧 Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/shoplite` |
| `JWT_SECRET` | Secret key for JWT | `your_random_secret_key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend application URL | `http://localhost:5173` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50,
  "image": "https://example.com/image.jpg"
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin_token>
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}
```

#### Update Cart Item
```http
PUT /api/cart/:itemId
Authorization: Bearer <token>
```

#### Remove from Cart
```http
DELETE /api/cart/:itemId
Authorization: Bearer <token>
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [...],
  "shippingAddress": {...},
  "paymentMethod": "Cash on Delivery"
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

---

## 💻 Usage

### For Customers

1. **Register/Login**: Create an account or log in to existing account
2. **Browse Products**: Explore available products on the home page
3. **View Details**: Click on any product to view detailed information
4. **Add to Cart**: Add desired products to your shopping cart
5. **Checkout**: Review your cart and proceed to checkout
6. **Place Order**: Complete the order with shipping information
7. **Track Orders**: View order history in the Orders page
8. **Update Profile**: Manage your profile information

### For Administrators

1. **Login**: Use admin credentials to access admin features
2. **Dashboard**: Access the admin dashboard at `/admin`
3. **Add Products**: Create new products with details and images
4. **Manage Products**: Edit or delete existing products
5. **View Orders**: Monitor all customer orders
6. **Manage Inventory**: Update stock levels and pricing

### Default Admin Account
To create an admin account, manually update a user's role to `'admin'` in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 📸 Screenshots

### Home Page
Browse through all available products with a clean, modern interface.

### Product Details
View detailed information about each product including pricing, description, and availability.

### Shopping Cart
Manage your cart items with easy quantity updates and removal options.

### Admin Dashboard
Comprehensive dashboard for managing products, orders, and inventory.

---

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs before storage
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Secure cookie handling
- **Input Validation**: Server-side validation for all user inputs
- **Protected Routes**: Route-level access control
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Role-Based Access**: Admin and user role separation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a new branch**: `git checkout -b feature/YourFeature`
3. **Make your changes**
4. **Commit your changes**: `git commit -m 'Add some feature'`
5. **Push to the branch**: `git push origin feature/YourFeature`
6. **Open a Pull Request**

### Coding Standards
- Follow ESLint configuration
- Write clean, readable code
- Add comments for complex logic
- Test your changes before submitting

---

## 🐛 Known Issues

- Cart persistence requires backend integration
- Image upload functionality needs cloud storage integration
- Payment gateway integration pending

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filters
- [ ] Product recommendations
- [ ] Email notifications
- [ ] Order tracking system
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Social media integration

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Suman Pradhan**

- GitHub: [@Sumanpradhan1706](https://github.com/Sumanpradhan1706)

---

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB team for the excellent database
- Express.js community
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team

---

<div align="center">

**Made with ❤️ by Suman Pradhan**

⭐ Star this repository if you find it helpful!

</div>
