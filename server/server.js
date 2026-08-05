import express from 'express'
import cors from 'cors'

import verificationRoutes from './routes/verificationRoutes.js'
import authRoutes from './routes/authRoutes.js'

import playerRoutes from "./routes/playerRoutes.js";

import scoutListRoutes from "./routes/scoutListRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express()

app.use(express.json())

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
   process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(
        new Error(`Origin ${origin} is not allowed by CORS.`)
      )
    },
    credentials: true
  })
)

app.use(
  '/api/auth',
  authRoutes
)

app.get('/', (req, res) => {
  res.status(200).send(`
    <h1
      style="
        text-align: center;
        margin-top: 50px;
      "
    >
      Scout Helper API
    </h1>
  `)
})

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Scout Helper API is running.'
  })
})

app.use(
  '/api/verifications',
  verificationRoutes
)

app.use(
  "/api/players",
  playerRoutes,
);

app.use(
  "/api/scout-list",
  scoutListRoutes,
);

app.use(
  "/api/teams",
  teamRoutes,
);

app.use(
  "/api/dashboard",
  dashboardRoutes,
);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  )
})