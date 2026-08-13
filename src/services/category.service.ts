import prisma from "../lib/prisma.js";
import { createSlug } from "../lib/slug.js";

export async function createCategory(name: string, description?: string) {
  const normalizedName = name.trim().replace(/\s+/g, " ");
  const slug = createSlug(normalizedName);

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
      isDeleted: false,
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const existingSlug = await prisma.category.findFirst({
    where: {
      slug,
      isDeleted: false,
    },
  });

  if (existingSlug) {
    throw new Error("Category slug already exists");
  }

  return prisma.category.create({
    data: {
      name: normalizedName,
      slug,
      description: description || null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryById(categoryId: string) {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function updateCategory(
  categoryId: string,
  data: { name?: string; description?: string }
) {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const updateData: { name?: string; slug?: string; description?: string } = {};

  if (data.name) {
    const normalizedName = data.name.trim().replace(/\s+/g, " ");
    const slug = createSlug(normalizedName);

    const duplicateName = await prisma.category.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: "insensitive",
        },
        id: {
          not: categoryId,
        },
        isDeleted: false,
      },
    });

    if (duplicateName) {
      throw new Error("Category name already exists");
    }

    updateData.name = normalizedName;
    updateData.slug = slug;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: updateData,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteCategory(categoryId: string) {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}