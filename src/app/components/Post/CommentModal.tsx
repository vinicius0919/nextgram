"use client";

import { useState } from "react";
import Modal from "react-modal";

import { Post as PostType } from "types/Post";
import FlashMessage from "../FlashMessage";
import Button from "../Button";
import { addComment } from "@/app/actions";
import { GrClose } from "react-icons/gr";
import Image from "next/image";

interface CommentModalProps {
  post: PostType;
  currentUserId?: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  post,
  currentUserId,
  isOpen,
  onRequestClose,
}) => {
  const [content, setContent] = useState("");
  const [flashMessage, setFlashMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleAddComment = async () => {
    if (!currentUserId) {
      window.location.href = "/login";
      return;
    }
    //validaçao

    if (!content.trim()) {
      setFlashMessage({
        type: "error",
        message: "O conteudo do comentario é obrigatório.",
      });
      return;
    }
    //utilização da action
    await addComment(post.id, currentUserId, content).then((response) => {
      if (response?.type === "error") {
        return setFlashMessage({
          type: "error",
          message: response.message,
        });
      }
    });
    setFlashMessage({
      type: "success",
      message: "Comentário adicionado com sucesso!",
    });
    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
    setContent("");
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Comment Modal"
      ariaHideApp={false}
      className="w-[704px] mt-28 mx-auto bg-white rounded border border-zinc-300"
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">Comentários</h2>
          <button
            onClick={onRequestClose}
            className="bg-red-600 hover:bg-red-400 text-white p-2 rounded-full "
          >
            <GrClose />
          </button>
        </div>
        {flashMessage && (
          <FlashMessage
            type={flashMessage.type}
            message={flashMessage.message}
          />
        )}
        <div className="mb-4 flex flex-col gap-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div className="flex items-center" key={comment.id}>
                {comment.user.image && (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.name || "User image"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                )}
                <p className="text-sm">
                  <strong>{comment.user.name || "User"}: </strong>
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p>Nenhum comentário</p>
          )}
        </div>
        {currentUserId && (
          <div className="mb-4 flex flex-col gap-6">
            <textarea
              className="w-full h-32 p-2 border border-zinc-300 rounded text-sm font-medium"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva seu comentário aqui..."
            ></textarea>
            <div className="flex justify-end">
              <Button
                type="button"
                text="Comentar"
                onClick={handleAddComment}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CommentModal;
