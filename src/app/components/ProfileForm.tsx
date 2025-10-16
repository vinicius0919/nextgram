"use client";
import { useFormState } from "react-dom";
import { updateUserProfile } from "../actions";
import { User } from "next-auth";
import Label from "./Label";
import Button from "./Button";
import ImagePreview from "./ImagePreview";

type ProfileFormProps = {
  user: User;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const [formState, setFormState] = useFormState(updateUserProfile, {
    message: "",
    type: "success",
  });
  return (
    <div>
      {formState.message && <p>{formState.message}</p>}
      <form className="flex flex-col gap-4" >
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
        <ImagePreview />
        <div className="flex justify-end">
          <Button type="submit" text="Salvar" />
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
