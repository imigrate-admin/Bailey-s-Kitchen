import { PrismaClient, BlogCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://via.placeholder.com/150',
    },
  });

  // Create some test blog posts
  const posts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'Getting Started with Healthy Eating',
        slug: 'getting-started-with-healthy-eating',
        excerpt: 'Learn the basics of healthy eating and how to make better food choices.',
        content: 'This is a detailed guide about healthy eating...',
        featuredImage: 'https://via.placeholder.com/800x400',
        category: BlogCategory.NUTRITION,
        tags: ['nutrition', 'health', 'food'],
        status: 'published',
        authorId: user.id,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Effective Workout Routines',
        slug: 'effective-workout-routines',
        excerpt: 'Discover the most effective workout routines for your fitness goals.',
        content: 'Here are some effective workout routines...',
        featuredImage: 'https://via.placeholder.com/800x400',
        category: BlogCategory.TRAINING,
        tags: ['fitness', 'workout', 'training'],
        status: 'published',
        authorId: user.id,
      },
    }),
  ]);

  // Add some comments to the posts
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great article! Very helpful information.',
        authorId: user.id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Looking forward to trying these workouts!',
        authorId: user.id,
        postId: posts[1].id,
      },
    }),
  ]);

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 