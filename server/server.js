import express from 'express'
import cors from 'cors'

import verificationRoutes from './routes/verificationRoutes.js'

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
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

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  )
})