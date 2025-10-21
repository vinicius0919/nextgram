"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const NotFoundContent = () => {
  // get param error from url
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (error == "OAuthAccountNotLinked") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-center mt-10">
          Conta já vinculada
        </h1>
        <p className="text-center mt-4">
          Parece que você já tem uma conta com esse provedor. Por favor, faça
          login com o provedor que você usou para criar sua conta.
        </p>
        <Link
          href="/signin"
          className="text-blue-500 underline block text-center mt-4"
        >
          Voltar para a pagina de login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-10">
        Página não encontrada
      </h1>
      <Link href="/" className="text-blue-500 underline block text-center mt-4">
        Voltar para a pagina inicial
      </Link>
    </div>
  );
};

const NotFound = () => {
  return (
    <Suspense fallback={<div className="text-center mt-10">Carregando...</div>}>
      <NotFoundContent />
    </Suspense>
  );
};

export default NotFound;
