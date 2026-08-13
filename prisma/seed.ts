import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {
  console.log("Seeding database...");

  // Seed Admin User
  const adminPassword = await bcrypt.hash("AdminPass123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created Admin user: ${admin.email}`);

  // Seed Normal User
  const userPassword = await bcrypt.hash("UserPass123!", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
    },
  });
  console.log(`Created Normal user: ${user.email}`);

  // Seed Categories
  const categoryElectronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Gadgets and electronic equipment",
    },
  });

  const categoryClothing = await prisma.category.upsert({
    where: { name: "Clothing" },
    update: {},
    create: {
      name: "Clothing",
      slug: "clothing",
      description: "Apparel and accessories",
    },
  });
  console.log("Created Categories: Electronics, Clothing");

  // Seed Products
  const productHeadphones = await prisma.product.create({
    data: {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Premium noise-canceling Bluetooth headphones",
      price: 99.99,
      stock: 25,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      status: "ACTIVE",
      categoryId: categoryElectronics.id,
    },
  });

  const productTshirt = await prisma.product.create({
    data: {
      name: "Cotton T-Shirt",
      slug: "cotton-t-shirt",
      description: "100% organic cotton comfortable t-shirt",
      price: 19.99,
      stock: 50,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      status: "ACTIVE",
      categoryId: categoryClothing.id,
    },
  });
  console.log(`Created Products: ${productHeadphones.name}, ${productTshirt.name}`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
