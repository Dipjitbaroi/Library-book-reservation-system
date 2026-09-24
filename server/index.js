import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 3001
const jwtSecret = process.env.JWT_SECRET || 'development-only-secret'
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
const cloudinaryReady = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
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

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return res.status(503).json({ error: 'Admin credentials are not configured.' })
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid admin credentials.' })
  res.json({ token: jwt.sign({ role: 'admin', email }, jwtSecret, { expiresIn: '8h' }), email })
})

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, jwtSecret)
    if (payload.role !== 'admin') throw new Error('Not an admin')
    next()
  } catch {
    res.status(401).json({ error: 'Admin authentication required.' })
  }
}

app.get('/api/admin/books', requireAdmin, async (_req, res) => {
  try { res.json(await prisma.book.findMany({ orderBy: { createdAt: 'desc' } })) } catch (error) { reportDatabaseError('admin books query failed', error); res.status(503).json({ error: 'Books could not be loaded.' }) }
})

app.post('/api/admin/books', requireAdmin, async (req, res) => {
  try {
    const book = await prisma.book.create({ data: { title: req.body.title, author: req.body.author, genre: req.body.genre, description: req.body.description, visualStyle: req.body.visualStyle || 'sage', imageUrl: req.body.imageUrl || null, featured: Boolean(req.body.featured) } })
    res.status(201).json(book)
  } catch (error) { reportDatabaseError('admin book create failed', error); res.status(400).json({ error: 'Book could not be created.' }) }
})

app.put('/api/admin/books/:id', requireAdmin, async (req, res) => {
  try {
    const book = await prisma.book.update({ where: { id: req.params.id }, data: { title: req.body.title, author: req.body.author, genre: req.body.genre, description: req.body.description, visualStyle: req.body.visualStyle, imageUrl: req.body.imageUrl || null, featured: Boolean(req.body.featured) } })
    res.json(book)
  } catch (error) { reportDatabaseError('admin book update failed', error); res.status(400).json({ error: 'Book could not be updated.' }) }
})

app.delete('/api/admin/books/:id', requireAdmin, async (req, res) => {
  try { await prisma.book.delete({ where: { id: req.params.id } }); res.status(204).end() } catch (error) { reportDatabaseError('admin book delete failed', error); res.status(400).json({ error: 'Book cannot be deleted while reservations reference it.' }) }
})

app.get('/api/admin/reservations', requireAdmin, async (_req, res) => {
  try { res.json(await prisma.reservation.findMany({ include: { book: true }, orderBy: { createdAt: 'desc' } })) } catch (error) { reportDatabaseError('admin reservations query failed', error); res.status(503).json({ error: 'Reservations could not be loaded.' }) }
})

app.patch('/api/admin/reservations/:id', requireAdmin, async (req, res) => {
  try { res.json(await prisma.reservation.update({ where: { id: req.params.id }, data: { status: req.body.status } })) } catch (error) { reportDatabaseError('admin reservation update failed', error); res.status(400).json({ error: 'Reservation could not be updated.' }) }
})

app.delete('/api/admin/reservations/:id', requireAdmin, async (req, res) => {
  try { await prisma.reservation.delete({ where: { id: req.params.id } }); res.status(204).end() } catch (error) { reportDatabaseError('admin reservation delete failed', error); res.status(400).json({ error: 'Reservation could not be deleted.' }) }
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

app.post('/api/books/:id/image', requireAdmin, upload.single('image'), async (req, res) => {
  if (!cloudinaryReady) return res.status(503).json({ error: 'Cloudinary is not configured.' })
  if (!req.file) return res.status(400).json({ error: 'Please attach an image file.' })
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'shelfspace/books', resource_type: 'image' }, (error, response) => error ? reject(error) : resolve(response))
      stream.end(req.file.buffer)
    })
    const book = await prisma.book.update({ where: { id: req.params.id }, data: { imageUrl: result.secure_url, imagePublicId: result.public_id } })
    res.json(book)
  } catch (error) {
    reportDatabaseError('book image upload failed', error)
    res.status(400).json({ error: 'Book image could not be uploaded.' })
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
    const book = req.body.bookId
      ? await prisma.book.findUnique({ where: { id: req.body.bookId } })
      : await prisma.book.findUnique({ where: { title: req.body.bookTitle } })
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
