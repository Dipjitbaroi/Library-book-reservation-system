import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()
const cloudinaryReady = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET })

const books = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    description: 'A tender, thoughtful story about the lives we might have lived.',
    visualStyle: 'sage',
    imageSource: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&q=85',
    featured: true
  },
  {
    title: 'Braiding Sweetgrass',
    author: 'Robin Wall Kimmerer',
    genre: 'Nature & science',
    description: 'A lyrical exploration of plants, reciprocity, and our place in nature.',
    visualStyle: 'gold',
    imageSource: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=85',
    featured: true
  },
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    genre: 'Contemporary',
    description: 'A moving friendship story set inside the world of making games.',
    visualStyle: 'coral',
    imageSource: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=85',
    featured: true
  },
  {
    title: 'Pachinko',
    author: 'Min Jin Lee',
    genre: 'Historical fiction',
    description: 'An epic multigenerational story of family, identity, and belonging across twentieth-century Korea and Japan.',
    visualStyle: 'sage',
    imageSource: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=1200&q=85',
    featured: false
  },
  {
    title: 'The Overstory',
    author: 'Richard Powers',
    genre: 'Literary fiction',
    description: 'Nine lives become intertwined through a shared wonder for the forests that surround us.',
    visualStyle: 'gold',
    imageSource: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=85',
    featured: false
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-development',
    description: 'A practical guide to building better habits through small, consistent changes.',
    visualStyle: 'coral',
    imageSource: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=85',
    featured: false
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science fiction',
    description: 'A sweeping desert-world saga of power, ecology, prophecy, and resistance.',
    visualStyle: 'gold',
    imageSource: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=1200&q=85',
    featured: false
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    description: 'A memoir about education, self-invention, and finding a voice beyond one’s origins.',
    visualStyle: 'sage',
    imageSource: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=85',
    featured: false
  },
  {
    title: 'The Creative Act',
    author: 'Rick Rubin',
    genre: 'Creativity',
    description: 'A thoughtful meditation on attention, practice, and the conditions that let creativity emerge.',
    visualStyle: 'coral',
    imageSource: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1200&q=85',
    featured: false
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    genre: 'Popular science',
    description: 'An accessible journey through the origins of the universe, black holes, and the nature of time.',
    visualStyle: 'gold',
    imageSource: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=85',
    featured: false
  }
]

async function main() {
  for (const book of books) {
    let imageData = {}
    if (cloudinaryReady) {
      const uploaded = await cloudinary.uploader.upload(book.imageSource, { folder: 'shelfspace/books', public_id: book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), overwrite: true, resource_type: 'image' })
      imageData = { imageUrl: uploaded.secure_url, imagePublicId: uploaded.public_id }
    }
    const { imageSource, ...bookData } = book
    await prisma.book.upsert({ where: { title: book.title }, update: { ...bookData, ...imageData }, create: { ...bookData, ...imageData } })
  }

  await prisma.readerStory.deleteMany()
  await prisma.readerStory.create({
    data: {
      quote: 'Shelfspace makes borrowing feel like a small, lovely ritual again.',
      author: 'Maya',
      memberSince: 2022,
      featured: true
    }
  })
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })