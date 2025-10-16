import { auth } from "auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "../actions";
import Image from "next/image";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = async () => {
  const session = await auth();
  if (!session || !session.user?.email) {
    redirect("/");
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    redirect("/");
  }

  return (
    <div className="w-[35rem] mx-auto my-10 p-4" >
      <h1 className="text-[2rem] leading-10 font-semibold text-center" >Perfil de {user.name}</h1>
      <div className="w-full flex justify-center my-6">
        <Image
          src={user.image || ""}
          alt={user.name || ""}
          className="w-40 h-40 p-4 object-cover"
          width={320}
          height={320}
        />
      </div>
      <ProfileForm user={user} />
    </div>
  );
};

export default ProfilePage;
