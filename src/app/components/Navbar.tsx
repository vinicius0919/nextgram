import { auth, signIn, signOut } from "auth";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-lg font-bold">
        Home
      </Link>

      <div>
        {session && session.user ? (
          // login
          <div className="flex items-center gap-4">
            {/* name, email, image */}

            <p>{session.user.name}</p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Sair
              </button>
            </form>
          </div>
        ) : (
          // logout

          <Link
            href="/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Entrar
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
