# ⚡ PowerUp – EV Charging Station Manager

### 🚀 Full-Stack Web Application (Node.js + Express + React)

**Tech Stack:** Node.js, Express, SQLite, React.js, Leaflet, JWT, OpenStreetMap  
**Goal:** Build a scalable and interactive web platform to manage EV charging stations – from user login to geolocation mapping and data filtering.

---

## 📖 Project Description

**PowerUp** is a full-stack EV charging station management platform developed as part of a 5-day full-stack assignment. It showcases expertise in backend API development, secure authentication, interactive frontend UI, and deployment on cloud platforms.

The application allows users to register/login securely, manage EV charging stations, filter them by attributes, and visualize their locations on a map.

### ✅ Key Features:

- **User Authentication** with JWT (Signup/Login)
- **CRUD Operations** for charging stations
- **Filter Chargers** by status, power output, and connector type
- **Interactive Map** using Leaflet with OpenStreetMap
- **Geolocation Lookup** using Nominatim API
- **Protected Routes** for authorized access
- **Responsive Design** for desktop and mobile users
- **Cloud Deployment** for both frontend and backend

---

## 🌐 Live Demo & Deployment Links

- **Frontend:** [https://PowerUp-frontend-url.com](https://power-up-eight.vercel.app/authentication)
- **Backend API:** [https://PowerUp-backend-api-url.com](https://powerup-6csa.onrender.com)

---

## 📦 Project Structure

PowerUp/
├── backend/
│ ├── routes/
│ │ ├── auth.js
│ │ ├── chargingStations.js
│ │ └── geocode.js
│ ├── middleware/
│ │ └── auth.js
│ ├── appdata.db
│ └── server.js
│
├── frontend/
│ └── src/
│ ├── components/
│ │ ├── Header/
│ │ ├── Login/
│ │ ├── Register/
│ │ ├── MapView/
│ │ ├── ChargingStationForm/
│ │ ├── Loader/
│ │ ├── ProtectedRoute/
│ │ └── PublicRoute/
│ ├── pages/
│ │ ├── Home/
│ │ ├── Dashboard/
│ │ ├── Authentication/
│ │ └── About/
│ ├── App.js
│ └── index.js

## 🔐 Features Overview

### ✅ Authentication

- Secure JWT-based login and registration.
- Passwords hashed using **bcrypt**.
- Routes protected using custom middleware.

### 🔌 Charging Station Management

- Full **CRUD** support:
  - Add, edit, delete, and list charging stations.
- Attributes: `name`, `location`, `latitude`, `longitude`, `status`, `powerOutput`, `connectorType`.

### 🗺️ Map Integration

- Display all charging stations on a map using **Leaflet**.
- Integration with **OpenStreetMap** + reverse geocoding.
- Clickable map markers show detailed charger info.

### 🧭 Advanced Filters

- Filter by:
  - Status (Active/Inactive)
  - Power Output
  - Connector Type
  - Location keyword

---

## 🛠️ Technologies Used

| Frontend         | Backend           | Database | Tools & Other |
| ---------------- | ----------------- | -------- | ------------- |
| React 19         | Node.js + Express | SQLite   | JWT Auth      |
| React Router DOM | bcrypt, JWT       |          | Leaflet       |
| React Leaflet    | CORS, dotenv      |          | OpenStreetMap |
| JS-Cookie        | SQLite3 (node)    |          |               |

---

## 🧪 Setup Instructions

### 🔧 Backend Setup

```bash
cd backend
npm install

# Create .env file
echo "JWT_SECRET_CODE=your_secret" > .env

# Start the server
node server.js
# Server runs on http://localhost:5000
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## 🌍 API Endpoints

### 🔐 Auth Endpoints

- `POST /api/auth/register`  
  → Register a new user

- `POST /api/auth/login`  
  → Login and receive a JWT token

---

### ⚡ Charging Stations Endpoints (Protected)

- `GET /api/charging_stations`  
  → List all charging stations (supports optional filters: status, powerOutput, connectorType, location)

- `POST /api/charging_stations`  
  → Add a new charging station (requires JWT)

- `PUT /api/charging_stations/:id`  
  → Update charging station by ID (requires JWT)

- `DELETE /api/charging_stations/:id`  
  → Delete a charging station by ID (requires JWT)

---

### 🌐 Geocoding Endpoints

- `GET /api/geocode?q=location`  
  → Get coordinates (latitude, longitude) by location string

- `GET /api/geocode/reverse?lat=..&lon=..`  
  → Get address details by coordinates (reverse geocoding)

---

## 🚀 Deployment

- Frontend hosted on: **Vercel**
- Backend deployed via: **Render / Railway / Heroku**
- Maps loaded from OpenStreetMap (free API with no key required)

---

## 📚 Future Improvements

- Replace SQLite with MongoDB/PostgreSQL for scalability.
- Add unit tests and Swagger/OpenAPI documentation.
- Enable multi-user support and roles (Admin/User).
- Display nearest stations based on user location.
- Improve UX/UI with mobile-first design.
- Add notifications for charger status changes.

---

## 👨‍💻 Author

**Amarnath Racha**  
Feel free to connect with me for feedback, suggestions, or internship opportunities!

📧 Email: amarnath201099@gmail.com  
🌐 LinkedIn: [linkedin.com/in/amarnathracha](https://linkedin.com/in/amarnathracha)
