"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

async function requestPasswordReset(emailData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACK4APP_API_URL}/requestPasswordReset`, {
    method: "POST",
    headers: {
      "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
      "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailData.email,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao solicitar redefinição de senha.");
  }
  return {};
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const resetMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      alert("Código de recuperação enviado! Verifique seu e-mail.");
      router.push("/login");
    },
    onError: (error) => {
      alert("Erro: " + error.message);
    },
  });

  function handleChange(e) {
    setEmail(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      alert("Por favor, insira seu e-mail.");
      return;
    }

    resetMutation.mutate({ email });
  }

  const handleGoBack = () => router.push("/login");

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#AF7026] items-center justify-center relative p-12 overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          <div className="absolute -top-8 flex items-center">
            <img src="/LogoAbelha.png" alt="Logo Bookly" />
          </div>

          <div className="absolute -left-11 top-1/2 -translate-y-1/2 z-0">
            <img
              src="/AbelhaEsquerda.png"
              alt="Ilustração"
              className="object-contain opacity-60 mt-28"
            />
          </div>

          <div className="relative z-10 flex-1 flex items-end pb-6">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold text-white mb-4">
                Troque seus livros <br /> com a facilidade do Bookly!
              </h1>
              <p className="text-white text-lg">
                Conecte-se através de uma das opções abaixo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg p-4">
            <div className="mb-6">
              <span
                onClick={handleGoBack}
                className="text-[#AF7026] text-sm font-medium hover:underline flex items-center cursor-pointer"
              >
                &lt; Voltar
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Vamos recuperar sua conta!
            </h2>
            <p className="text-gray-600 mb-6">
              Preencha com seu email, e um código de recuperação será enviado para você.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              />

              <button
                type="submit"
                disabled={resetMutation.isPending}
                className="w-full mt-6 bg-[#7D4D0B] text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg hover:bg-[#6A4009] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetMutation.isPending ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}