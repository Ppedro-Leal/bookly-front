"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAuthStore from "../../store/userAuthStore";

async function registerUser(userData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACK4APP_API_URL}/users`, {
    method: "POST",
    headers: {
      "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
      "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userData.usuario,
      password: userData.senha,
      email: userData.email,
      nome: userData.nome,
      receberNovidades: userData.receberNovidades,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao cadastrar");
  }

  return response.json();
}

export default function CadastroPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    nome: "",
    usuario: "",
    email: "",
    confirmarEmail: "",
    senha: "",
    repetirSenha: "",
  });

  const [aceitarTermos, setAceitarTermos] = useState(false);
  const [receberNovidades, setReceberNovidades] = useState(false);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser(data);
      alert("Cadastro realizado com sucesso!");
      router.push("/");
    },
    onError: (error) => {
      alert("Erro ao cadastrar: " + error.message);
    },
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const voltar = () => router.back();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!aceitarTermos) {
      alert("Você precisa aceitar os Termos de Serviço e Política de Privacidade");
      return;
    }

    if (formData.email !== formData.confirmarEmail) {
      alert("Os e-mails não coincidem");
      return;
    }

    if (formData.senha !== formData.repetirSenha) {
      alert("As senhas não coincidem");
      return;
    }

    if (formData.senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    registerMutation.mutate({
      nome: formData.nome,
      usuario: formData.usuario,
      email: formData.email,
      senha: formData.senha,
      receberNovidades,
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo */}
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
              Boas-vindas ao Bookly!
            </h2>
            <p className="text-gray-600 mb-6">
              Preencha as informações abaixo para começar
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome e sobrenome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              />

              <div className="relative">
                <span className="absolute left-2 top-1.5 text-black text-3xl">
                  @
                </span>
                <input
                  type="text"
                  name="usuario"
                  placeholder="Usuário"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                />
              </div>

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
                type="email"
                name="confirmarEmail"
                placeholder="Confirmar e-mail"
                value={formData.confirmarEmail}
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
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              />

              <input
                type="password"
                name="repetirSenha"
                placeholder="Repetir senha"
                value={formData.repetirSenha}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
              />

              <div className="mt-6 space-y-3">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceitarTermos}
                    onChange={(e) => setAceitarTermos(e.target.checked)}
                    className="mt-1 mr-3 h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">
                    Ao continuar, você concorda com os{" "}
                    <span className="text-[#AF7026] hover:underline cursor-pointer">
                      Termos de Serviço
                    </span>{" "}
                    e{" "}
                    <span className="text-[#AF7026] hover:underline cursor-pointer">
                      Política de privacidade
                    </span>
                    .
                  </span>
                </label>

                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={receberNovidades}
                    onChange={(e) => setReceberNovidades(e.target.checked)}
                    className="mt-1 mr-3 h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">
                    Desejo receber novidades e promoções do Bookly
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full mt-6 bg-[#7D4D0B] text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg hover:bg-[#6A4009] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerMutation.isPending ? "Cadastrando..." : "Registrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}