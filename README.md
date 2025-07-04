# Simple E-commerce API

A simple e-commerce backend and frontend built with Node.js and Express, featuring JWT authentication, user roles, product management, cart, and order functionality. Includes a modern HTML+JS frontend for easy interaction.

## Features

- User registration and login (JWT-based)
- Customer and admin roles
- Product listing with pagination and search
- Cart management
- Order creation and viewing
- Admin product management (add, update, delete)
- Modern, responsive frontend (HTML+JS)
- In-memory data storage (easy to switch to a real database)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd server
   npm install
   ```
3. Start the backend server:
   ```
   node server.js
   ```
4. Open the frontend:
   - Open `client/index.html` in your browser
   - Or serve the `client/` folder with a static server

## API Endpoints

### Auth

- `POST /auth/register` — Register a new user (`username`, `password`, `role`)
- `POST /auth/login` — Login and receive a JWT

### Products

- `GET /products` — List products (supports `page`, `limit`, `name`, `category`)
- `POST /products` — Add product (admin only)
- `PUT /products/:id` — Update product (admin only)
- `DELETE /products/:id` — Delete product (admin only)

### Cart

- `GET /cart` — View current user's cart
- `POST /cart` — Add/update item (`productId`, `quantity`)
- `DELETE /cart/:productId` — Remove item from cart

### Orders

- `POST /orders` — Create order from cart (customer only)
- `GET /orders` — View orders (customer: own, admin: all)

## Usage

- Register as a customer or admin
- Login to receive a JWT (used for protected routes)
- Browse, search, and paginate products
- Customers: add to cart, place orders
- Admins: manage products

## Notes

- All data is stored in memory. Data resets when the server restarts.
- To use a real database, replace the in-memory arrays/objects in `server/models/` with database logic.

## License

MIT
