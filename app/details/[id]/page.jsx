"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";

// 🔹 Configuração da API direto aqui
const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

// 🔹 Função para buscar livro por ID
async function fetchBookById(id) {
  const url = `${API_BASE_URL}/classes/Book/${id}?include=category,owner,genres`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error("Erro ao buscar livro por ID");
  return await res.json();
}

export default function DetalhesLivro() {
  const { id } = useParams();

  // 🔹 Faz a requisição ao Back4App
  const { data: livro, isLoading, isError } = useQuery({
    queryKey: ["livro", id],
    queryFn: () => fetchBookById(id),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-10 text-center">Carregando livro...</p>;
  if (isError || !livro) return <p className="p-10 text-center">Erro ao carregar livro.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => history.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Capa */}
          <div>
            <img
              src={livro.cover?.url || "/placeholder-book.png"}
              alt={livro.title}
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{livro.title}</h1>
            <p className="text-lg text-gray-600">por {livro.author}</p>

            <Card>
              <CardContent>
                <h4 className="text-lg font-semibold">Sobre o livro</h4>
                <p>{livro.description || "Sem descrição disponível."}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h4 className="text-lg font-semibold">Doado por</h4>
                <p>{livro.owner?.name || "Doador desconhecido"}</p>
                <p className="text-sm text-gray-500">{livro.owner?.city}</p>
              </CardContent>
            </Card>

            <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Entre em contato!
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


