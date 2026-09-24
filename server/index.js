import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'shelfspace-api' })
})

app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        ...req.body,
        pickupDate: new Date(req.body.pickupDate),
        durationDays: Number(req.body.durationDays)
      }
    })
    res.status(201).json(reservation)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Reservation could not be saved.' })
  }
})

app.listen(port, () => {
  console.log(`Shelfspace API listening on http://localhost:${port}`)
})
