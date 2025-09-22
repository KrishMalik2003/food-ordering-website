# FoodOrderingWebsiteTest

A simple food ordering demo with:
- Frontend: static `index.html`, `styles.css`, `script.js`
- Backend: Node.js + Express server (`server.js`)
- Database: MongoDB (local) using Mongoose
- Tests (optional): Java + Maven + Selenium (sample scaffolding)

## Prerequisites
- Node.js 18+ and npm
- MongoDB running locally at `mongodb://localhost:27017`
- (Optional) Java 8+ and Maven (for the Selenium test project)

## Getting Started

1) Install dependencies
```bash
npm install
```

2) Start MongoDB
- Ensure a local MongoDB instance is running (default port 27017).
- The app uses database `foodorder`.

3) Start the server
```bash
npm start
```
- Server runs on `http://localhost:3000`

4) Open the frontend
- Open `index.html` directly in your browser OR serve it via any static server.
- The frontend calls the backend at `http://localhost:3000`.

## API Endpoints

Base URL: `http://localhost:3000`

- Register
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "plain-text",
  "mobile": "9999999999"
}
```
Response:
```json
{ "success": true }
```
If user exists:
```json
{ "success": false, "message": "User already exists" }
```

- Login
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "plain-text"
}
```
Response:
```json
{ "success": true }
```
Or:
```json
{ "success": false, "message": "Invalid credentials" }
```

- Place Order
```http
POST /order
Content-Type: application/json

{
  "userEmail": "user@example.com",
  "cart": [
    { "name": "Pizza", "price": 12.5, "quantity": 2 }
  ],
  "total": 25.0
}
```
Response:
```json
{ "success": true, "message": "Order saved" }
```

## Project Scripts
- `npm start` — starts the Express server on port 3000

## Folder Structure
```
.
├─ index.html
├─ styles.css
├─ script.js
├─ server.js
├─ package.json
├─ pom.xml
└─ src/
   └─ main/java/... (Java test scaffolding)
```

## Configuration
- MongoDB URI is currently hardcoded in `server.js`:
  `mongodb://localhost:27017/foodorder`
- To customize, you can replace it with an environment variable pattern, e.g.:
  ```js
  const MONGO_URI = process.env.MONGO_URI || mongodb://localhost:27017/foodorder;
  ```
  and start with:
  ```bash
  MONGO_URI="mongodb://localhost:27017/foodorder" npm start
  ```

## Security Notice
- Passwords are stored in plain text (demo-only). For production, use hashing (e.g., bcrypt) and proper auth/session handling.

## Troubleshooting
- Port in use: change `PORT` in `server.js` or free the port 3000.
- MongoDB connection error: ensure MongoDB is running locally on 27017, or update the URI.
- CORS issues: CORS is enabled in `server.js` via `cors()`.

## Git Hygiene (already set up)
The repository excludes large and generated files, including:
- `node_modules/`, `target/`, `.DS_Store`, backup bundles, and `chrome-mac-arm64/`.

## License
ISC (see `package.json`), or choose your preferred license.
