import { prisma } from "../src/lib/prisma";

const courses = [
  {
    id: "nextjs",
    title: "Full-Stack Next.js",
    price: 89,
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    price: 129,
  },
  {
    id: "devops",
    title: "Cloud Native DevOps",
    price: 99,
  },
] as const;

async function main() {
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      create: course,
      update: {
        title: course.title,
        price: course.price,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
