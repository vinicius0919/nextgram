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

  if (name.length < 3) {
    return { message: "O nome deve ter pelo menos 3 caracteres.", type: "error" };
  }

  if (session.user.userId !== id) {
    return { message: "Acesso negado.", type: "error" };
  }

  // save da imagem

  let imageUrl
  if (imageFile && imageFile.name !== "undefined" ) {
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

  revalidatePath("/profile")

  return { message: "Perfil atualizado com sucesso!", type: "success" };
}
