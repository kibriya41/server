import prisma from "../lib/prisma.js";

export async function getAllUsers() {
  return prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
  }
) {
  const existingUser = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (data.email) {
    const normalizedEmail = data.email.toLowerCase().trim();

    const emailExists = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        id: {
          not: userId,
        },
        isDeleted: false,
      },
    });

    if (emailExists) {
      throw new Error("Email is already in use");
    }

    data.email = normalizedEmail;
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN"
) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}