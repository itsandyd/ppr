import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  try {
    // Check if tables exist and create them if they don't
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS ChapterEmbedding (
        id VARCHAR(191) NOT NULL,
        embedding JSON NULL,
        chapterId VARCHAR(191) NOT NULL UNIQUE,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL,
        PRIMARY KEY (id)
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS VectorEmbedding (
        id VARCHAR(191) NOT NULL,
        content TEXT NULL,
        embedding JSON NULL,
        userId VARCHAR(191) NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL,
        PRIMARY KEY (id)
      );
    `;

    // Create indexes
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS ChapterEmbedding_chapterId_idx 
      ON ChapterEmbedding(chapterId);
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS VectorEmbedding_userId_idx 
      ON VectorEmbedding(userId);
    `;

    // Safely modify columns to VECTOR type
    console.log('Converting embedding columns to VECTOR type...');
    
    // For ChapterEmbedding
    try {
      await prisma.$executeRaw`
        ALTER TABLE ChapterEmbedding 
        MODIFY COLUMN embedding VECTOR(1536);
      `;
      console.log('✅ ChapterEmbedding vector column set up successfully!');
    } catch (error: any) {
      if (error.message.includes('Duplicate')) {
        console.log('ℹ️ ChapterEmbedding vector column already exists');
      } else {
        throw error;
      }
    }

    // For VectorEmbedding
    try {
      await prisma.$executeRaw`
        ALTER TABLE VectorEmbedding 
        MODIFY COLUMN embedding VECTOR(1536);
      `;
      console.log('✅ VectorEmbedding vector column set up successfully!');
    } catch (error: any) {
      if (error.message.includes('Duplicate')) {
        console.log('ℹ️ VectorEmbedding vector column already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ Vector setup completed successfully!');
  } catch (error) {
    console.error('❌ Error during vector setup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  
  return response.data[0].embedding;
}

main(); 