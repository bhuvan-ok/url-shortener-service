# 🔗 URL Shortener Service

A full-stack URL shortener application that generates short links, tracks analytics, and provides a real-time dashboard.

Built to demonstrate backend system design concepts like caching, rate limiting, database indexing, and scalable architecture.

---

##  Live Demo

(Coming soon – deploy to Render/Vercel)

---

##  Features

 Generate short URLs from long links
 Fast redirects using Redis caching
 Click analytics & daily stats
 Dashboard with charts (Chart.js)
 Rate limiting to prevent abuse
Dockerized development setup
 Clean REST APIs

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express
* MongoDB (Mongoose)
* Redis (ioredis)
* express-rate-limit
* Morgan logging

### Frontend

* React (Vite)
* Axios
* Chart.js

### DevOps

* Docker & Docker Compose

---

##  Architecture

Client (React)
↓
Express API
↓
Redis (cache for fast redirects)
↓
MongoDB (persistent storage + analytics)

---

##  How It Works

### Shorten Flow

1. User submits long URL
2. Server generates Base62 short code
3. Stores mapping in MongoDB
4. Returns short URL

### Redirect Flow

1. Check Redis cache
2. If miss → fetch from MongoDB
3. Cache result (24h TTL)
4. Increment click counters
5. Redirect

---

##  API Endpoints

POST `/api/shorten`
Create short URL

GET `/api/recent`
Get latest URLs

GET `/api/analytics`
Get overall analytics

GET `/api/stats/:code`
Get stats for specific link

GET `/:code`
Redirect to original URL

---

##  Run Locally

### Option 1 – Docker (recommended)

```
docker-compose up
```

### Option 2 – Manual

Backend:

```
cd backend
npm install
npm run dev
```

Frontend:

```
cd frontend
npm install
npm run dev
```

---

##  Environment Variables (optional for production)

Create `.env` in backend:

```
MONGO_URL=your_mongodb_url
REDIS_URL=your_redis_url
PORT=5000
```

---

## Future Improvements

* Redis INCR for distributed ID generation
* WebSockets instead of polling
* Authentication & API keys
* Link expiration
* Custom aliases
* Horizontal scaling

---

##  Learning Goals

This project was built to practice:

* Caching strategies
* Database indexing
* Rate limiting
* Analytics aggregation
* Full-stack integration
* System design thinking

---

## Author

Bhuvan Kishore
GitHub: [https://github.com/yourusername](https://github.com/yourusername)

---
