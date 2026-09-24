-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
