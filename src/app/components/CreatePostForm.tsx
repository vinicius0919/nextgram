"use client";
import { useActionState, useState } from "react";
import FlashMessage from "./FlashMessage";
import Label from "./Label";
import { createPost } from "../actions";
import ImagePreview from "./ImagePreview";
import Button from "./Button";
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const CreatePostForm: React.FC = () => {
  const [formState, formAction] = useActionState(createPost, {
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
        <ImagePreview setFileSize={setFileSize} />

        <div>
          <Label htmlFor="caption" text="Conteudo do Post" />
          <textarea
            id="caption"
            name="caption"
            placeholder="Escreva algo sobre sua foto..."
            className="h-32 p-2 border border-zinc-500 rounded w-full text-sm placeholder:text-zinc-500 focus:ring-0 focus:outline-none"
          ></textarea>
        </div>
        <div className="flex justify-end">
          {fileSize < MAX_FILE_SIZE && <Button type="submit" text="Salvar" />}
          {fileSize > MAX_FILE_SIZE && <Button text="Salvar" disabled />}
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
