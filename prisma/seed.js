import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const books = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    description: 'A tender, thoughtful story about the lives we might have lived.',
    visualStyle: 'sage',
    featured: true
  },
  {
    title: 'Braiding Sweetgrass',
    author: 'Robin Wall Kimmerer',
    genre: 'Nature & science',
    description: 'A lyrical exploration of plants, reciprocity, and our place in nature.',
    visualStyle: 'gold',
    featured: true
  },
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    genre: 'Contemporary',
    description: 'A moving friendship story set inside the world of making games.',
    visualStyle: 'coral',
    featured: true
  }
]

async function main() {
  for (const book of books) {
    await prisma.book.upsert({ where: { title: book.title }, update: book, create: book })
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