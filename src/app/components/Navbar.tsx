import { auth, signIn, signOut } from "auth";
import Link from "next/link";
import { getUserByEmail } from "../actions";
import Image from "next/image";
import Button from "./Button";
import ButtonLink from "./ButtonLink";

const Navbar = async () => {
  const session = await auth();

  const user = await getUserByEmail(session?.user?.email);
  return (
    <div className="bg-gray-800 text-white px-10 py-5 flex justify-between items-center max-sm:flex-col max-sm:gap-1">
      <Link
        href="/"
        className="text-white hover:text-zinc-200 text-lg font-bold"
      >
        NextGram
      </Link>

      <div>
        {user ? (
          // login
          <div className="flex items-center gap-4 ">
            {/* name, email, image */}

            <p className="text-white font-medium max-sm:hidden ">{user.name}</p>
            {user?.image && (
              <Image
                src={user.image || ""}
                alt={user.name || ""}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full max-sm:hidden"
              />
            )}
            <Link
              href="/profile"
              className="text-white font-medium hover:text-zinc-200"
            >
              Perfil
            </Link>
            <Link
              href="/post/new"
              className="text-white font-medium hover:text-zinc-200"
            >
              Novo Post
            </Link>
            <Link
              href="/my-posts"
              className="text-white font-medium hover:text-zinc-200"
            >
              Meus Posts
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button text="Sair" danger={true} />
            </form>
          </div>
        ) : (
          // logout

          <ButtonLink
            url="/signin"
            text="Entrar"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
