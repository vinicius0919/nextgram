import { auth } from "auth";
import { redirect } from "next/navigation";
import { deletePost, getUserPosts } from "../actions";
import ButtonLink from "../components/ButtonLink";
import Image from "next/image";
import Button from "../components/Button";

const MyPosts = async () => {
  const session = await auth();
  if (!session) redirect("/");
  let userId;

  if (session) {
    userId = session.user.userId;
  } else {
    redirect("/");
  }

  const posts = await getUserPosts(userId);

  return (
    <div className="w-[35rem] max-sm:w-full mx-auto my-10 p-4">
      <h1 className="text-[2rem] leading-10 font-semibold text-center mb-8">
        Minhas Postagens
      </h1>
      {posts.length === 0 && (
        <div className="text-center">
          <p>Você ainda não criou nenhuma postagem.</p>
          <div className="flex justify-center">
            <ButtonLink url="/post/new" text="Criar meu primeiro post" />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded p-4 shadow-sm">
            <Image
              src={post.imageUrl}
              alt={post.caption || "Post image"}
              className="w-[366px] h-[218px] object-cover mb-4 rounded"
              width={366}
              height={218}
            />
            <p>{post.caption ? post.caption : "Sem descrição"}</p>
            <form action={deletePost}>
              <input type="hidden" name="userId" value={post.userId} />
              <input type="hidden" name="postId" value={post.id} />
              <div className="flex justify-end">
                <Button type="submit" text="Excluir" danger={true} />
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
