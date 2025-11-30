"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/userAuthStore";

async function loginUser(credentials) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACK4APP_API_URL}/login?username=${credentials.email}&password=${credentials.senha}`,
    {
      method: "GET",
      headers: {
        "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
        "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || "Erro de login. Verifique seu e-mail e senha."
    );
  }

  return response.json();
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data);
      alert("Login realizado com sucesso!");
      router.push("/");
    },
    onError: (error) => {
      alert("Erro ao fazer login: " + error.message);
    },
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    loginMutation.mutate({
      email: formData.email,
      senha: formData.senha,
    });
  }

  const irParaHome = () => router.push("/");
  const voltar = () => router.back();
  const irParaEsqueciSenha = () => router.push("/esqueciSenha");
  const irParaCadastro = () => router.push("/cadastro");

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
                onClick={voltar}
                className="text-[#AF7026] text-lg font-medium hover:underline flex items-center cursor-pointer"
              >
                &lt; Voltar
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bom te ver novamente!
            </h2>
            <p className="text-gray-600 mb-6">Faça seu login.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              />

              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              />

              <div className="flex justify-start pt-1">
                <span
                  onClick={irParaEsqueciSenha}
                  className="text-[#AF7026] text-sm hover:underline font-medium cursor-pointer"
                >
                  Esqueci minha senha &gt;
                </span>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full mt-6 bg-[#7D4D0B] text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg hover:bg-[#6A4009] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Ainda não tem conta?{" "}
              <span
                onClick={irParaCadastro}
                className="text-[#AF7026] hover:underline font-semibold cursor-pointer"
              >
                Cadastre-se
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
