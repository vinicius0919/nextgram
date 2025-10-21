"use server";
import { PrismaClient, User } from "@prisma/client";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { promises as fs } from "fs";

const prisma = new PrismaClient();
import path from "path";
import { revalidatePath } from "next/cache";

type FormState = {
  message: string;
  type: string;
};

export async function getUserByEmail(
  email: string | null
): Promise<User | null> {
  if (!email) return null;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  return user;
}

export async function updateUserProfile(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session) redirect("/");
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File;

  if (session.user.userId !== id) {
    return { message: "Acesso negado.", type: "error" };
  }

  console.log(imageFile.size);
  // check if body size limit exceeded
  if (imageFile.size > 1 * 1024 * 1024) {
    return {
      message: "O tamanho da imagem deve ser inferior a 1MB.",
      type: "error",
    };
  }

  if (name.length < 3) {
    return {
      message: "O nome deve ter pelo menos 3 caracteres.",
      type: "error",
    };
  }

  // save da imagem

  let imageUrl;
  if (imageFile && imageFile.name !== "undefined") {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, imageFile.name);
    const arrayBuffer = await imageFile.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    imageUrl = `/uploads/${imageFile.name}`;
  }

  const dataToUpdate = imageUrl ? { name, image: imageUrl } : { name };

  await prisma.user.update({
    where: {
      id: id,
    },
    data: dataToUpdate,
  });

  revalidatePath("/profile");

  return { message: "Perfil atualizado com sucesso!", type: "success" };
}

export async function createPost(
  formState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session) redirect("/");

  const caption = formData.get("caption") as string;
  const imageFile = formData.get("image") as File;

  if (!imageFile || imageFile.name === "undefined") {
    return { message: "A imagem é obrigatória.", type: "error" };
  }

  // check if body size limit exceeded
  console.log(imageFile.size);
  if (imageFile.size > 1 * 1024 * 1024) {
    return {
      message: "O tamanho da imagem deve ser inferior a 1MB.",
      type: "error",
    };
  }

  if (!caption || imageFile.size === 0) {
    return {
      message: "O conteudo do post é obrigatório.",
      type: "error",
    };
  }

  // criar o post
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  // cria o diretorio se nao existir
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, imageFile.name);
  const arrayBuffer = await imageFile.arrayBuffer();
  // cria o arquivo no diretorio
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  // caminho para salvar no banco
  const imageUrl = `/uploads/${imageFile.name}`;

  await prisma.post.create({
    data: {
      caption: caption,
      imageUrl: imageUrl,
      userId: session.user.userId,
    },
  });

  revalidatePath("/");
  redirect("/");
}

// resgatar posts de um usuario
export async function getUserPosts(userId: string) {
  const session = await auth();
  if (!session) redirect("/");

  if (session.user.userId !== userId) {
    throw new Error("Acesso negado.");
  }

  return await prisma.post.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: true,
      likes: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deletePost(formData: FormData) {
  const session = await auth();
  if (!session) redirect("/");

  const userId = formData.get("userId") as string;
  const postId = formData.get("postId") as string;

  if (session.user.userId !== userId) {
    throw new Error("Acesso negado.");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  revalidatePath("/my-posts");
  redirect("/my-posts");
}

// resgatar posts de um usuario
export async function getAllPosts() {
  return await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function likePost(postId: string, userId: string) {
  const session = await auth();
  if (!session) redirect("/");

  if (session.user.userId !== userId) {
    throw new Error("Acesso negado.");
  }

  // verificar se o usuario ja curtiu o post
  const existingLike = await prisma.like.findFirst({
    where: {
      postId: postId,
      userId: userId,
    },
  });

  if (existingLike) {
    // se ja curtiu, remover a curtida
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    // se nao curtiu, adicionar a curtida
    await prisma.like.create({
      data: {
        postId: postId,
        userId: userId,
      },
    });
  }

  revalidatePath("/");
}

// criar comentario
export async function addComment(
  postId: string,
  userId: string,
  content: string
) {
  const session = await auth();
  if (!session) redirect("/");

  if (session.user.userId !== userId) {
    throw new Error("Acesso negado.");
  }

  if (!content) {
    return {
      message: "O conteudo do comentario é obrigatório.",
      type: "error",
    };
  }

  await prisma.comment.create({
    data: {
      postId,
      userId,
      content,
    },
  });

  revalidatePath("/");
}
