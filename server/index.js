import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 3001
let lastDatabaseError = ''
let lastDatabaseErrorAt = 0

function reportDatabaseError(context, error) {
  const message = error instanceof Error ? error.message.split('\n')[0] : String(error)
  const now = Date.now()
  if (message === lastDatabaseError && now - lastDatabaseErrorAt < 5000) return
  lastDatabaseError = message
  lastDatabaseErrorAt = now
  console.error(`[database] ${context}: ${message}`)
}

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'shelfspace-api' })
})

app.get('/api/books', async (_req, res) => {
  try {
    const books = await prisma.book.findMany({ orderBy: { createdAt: 'asc' } })
    res.json(books)
  } catch (error) {
    reportDatabaseError('books query failed', error)
    res.status(503).json({ error: 'Books could not be loaded.' })
  }
})

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: req.params.id } })
    if (!book) return res.status(404).json({ error: 'Book not found.' })
    res.json(book)
  } catch (error) {
    reportDatabaseError('book detail query failed', error)
    res.status(503).json({ error: 'Book could not be loaded.' })
  }
})

app.get('/api/stories/featured', async (_req, res) => {
  try {
    const story = await prisma.readerStory.findFirst({ where: { featured: true }, orderBy: { createdAt: 'desc' } })
    res.json(story)
  } catch (error) {
    reportDatabaseError('reader story query failed', error)
    res.status(503).json({ error: 'Reader story could not be loaded.' })
  }
})

app.post('/api/reservations', async (req, res) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: req.body.bookId } })
    if (!book) return res.status(400).json({ error: 'Please choose a valid book.' })
    const reservation = await prisma.reservation.create({
      data: {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        memberType: req.body.memberType,
        bookTitle: book.title,
        bookId: book.id,
        notes: req.body.notes || null,
        pickupDate: new Date(req.body.pickupDate),
        durationDays: Number(req.body.durationDays)
      }
    })
    res.status(201).json(reservation)
  } catch (error) {
    reportDatabaseError('reservation insert failed', error)
    res.status(400).json({ error: 'Reservation could not be saved.' })
  }
})

app.listen(port, () => {
  console.log(`Shelfspace API listening on http://localhost:${port}`)
})
