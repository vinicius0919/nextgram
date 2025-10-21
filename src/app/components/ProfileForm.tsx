"use client";
import { useActionState, useState } from "react";
import { updateUserProfile } from "../actions";
import { User } from "next-auth";
import Label from "./Label";
import Button from "./Button";
import ImagePreview from "./ImagePreview";
import FlashMessage from "./FlashMessage";

type ProfileFormProps = {
  user: User;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const [formState, formAction] = useActionState(updateUserProfile, {
    message: "",
    type: "success",
  });
  const [fileSize, setFileSize] = useState<number>(0);
  return (
    <div>
      {formState.message && (
        <FlashMessage message={formState.message} type={formState.type} />
      )}
      <form className="flex flex-col gap-4" action={formAction}>
        <input type="hidden" name="id" value={user.id} />
        <div>
          <Label htmlFor="name" text="Nome" />
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name || ""}
            className="p-2 border border-zinc-500 rounded w-full text-sm placeholder:text-zinc-500 focus:ring-0 focus:outline-none"
          />
        </div>
        <ImagePreview setFileSize={setFileSize} />
        <div className="flex justify-end">
          {fileSize < MAX_FILE_SIZE && <Button type="submit" text="Salvar" />}
          {fileSize > MAX_FILE_SIZE && <Button text="Salvar" disabled />}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
