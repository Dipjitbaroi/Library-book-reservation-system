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