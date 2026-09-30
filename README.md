# E-Commerce Backend System

A RESTful E-Commerce Backend System built using Node.js, Express.js, MongoDB and Mongoose.

This project provides authentication, authorization, product management, order management, user profile management, product search/filter/sort and recommendation functionality.

## Features

- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Admin and user authorization
- User profile CRUD
- Product CRUD
- Product search
- Product category filtering
- Product price filtering
- Product sorting
- Order creation and management
- Stock quantity management
- Input validation
- Centralized error handling
- RapidMiner-based recommendation analysis
- RESTful API architecture

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)
- dotenv
- cors
- RapidMiner
- Postman
- Git
- GitHub

## Project Structure

```text
ecommerce-backend/
│
├── analytics/
│   ├── recommendation_data.csv
│   └── recommendations.json
│
├── config/
│   └── dbConnection.js
│
├── controllers/
│   ├── analyticsController.js
│   ├── authentication.js
│   ├── orderController.js
│   ├── productController.js
│   └── userProfile.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validationMiddleware.js
│
├── models/
│   ├── order.js
│   ├── product.js
│   └── user.js
│
├── routes/
│   ├── analyticsRoutes.js
│   ├── authenticationRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── testRoutes.js
│   └── userProfileRoutes.js
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```
