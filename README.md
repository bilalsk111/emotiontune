# EmotionTune 🎵😊

EmotionTune is an innovative full-stack web application that combines facial expression recognition with music discovery. By analyzing your real-time emotions, EmotionTune curates and plays the perfect music to match or elevate your mood. 

## ✨ Features

- **Emotion-Based Music Recommendations:** Uses MediaPipe Vision to detect your facial expressions and suggests songs accordingly.
- **User Authentication:** Secure signup and login system using JWT and bcrypt.
- **Music Library & Favorites:** Browse a vast collection of music (integrated with YouTube/JioSaavn), and manage your favorite tracks.
- **Dashboard & Analytics:** View your emotion history and listening habits visualized with Recharts.
- **Image & File Uploads:** Profile picture management powered by ImageKit and Multer.
- **High Performance:** Backend caching implemented with Redis for lightning-fast responses.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) (with Vite for fast bundling)
- [MediaPipe Vision](https://developers.google.com/mediapipe) (for real-time emotion detection)
- [React Router DOM](https://reactrouter.com/) (for routing)
- [Recharts](https://recharts.org/) (for data visualization)
- [Sass](https://sass-lang.com/) (for styling)
- [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (with Mongoose)
- [Redis](https://redis.io/) (for caching)
- [ImageKit](https://imagekit.io/) & [Multer](https://www.npmjs.com/package/multer) (for file handling)
- [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt](https://www.npmjs.com/package/bcrypt) (Security)
- [yt-search](https://www.npmjs.com/package/yt-search) & [node-id3](https://www.npmjs.com/package/node-id3) (Music metadata)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine. You will also need a [Redis](https://redis.io/) server running.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bilalsk111/emotiontune.git
   cd emotiontune
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add your environment variables (e.g., MongoDB URI, JWT Secret, Redis URL, ImageKit credentials).
   
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see the application in action.

## 📂 Project Structure

```text
modifier/
├── backend/
│   ├── config/          # Database and external service configurations
│   ├── controllers/     # API route controllers (auth, song, saavn)
│   ├── middlewares/     # Express middlewares (auth, file upload)
│   ├── models/          # Mongoose database schemas (user, song, fav)
│   ├── routes/          # Express API routes
│   ├── services/        # Business logic and external API integrations
│   ├── utils/           # Utility functions
│   ├── server.js        # Entry point for backend
│   └── app.js           # Express app setup
└── frontend/
    ├── src/
    │   ├── features/    # Domain-specific components (Auth, Home, Expression)
    │   ├── App.jsx      # Main React application component
    │   ├── main.jsx     # React entry point
    │   └── app.route.jsx# Application routing
    ├── public/          # Static assets
    └── vite.config.js   # Vite configuration
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/bilalsk111/emotiontune/issues).

## 📝 License

This project is licensed under the ISC License.
