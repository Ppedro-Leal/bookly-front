"use client";

import { BookCard } from "../components/BookCard";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { User, BookOpen, Network } from "lucide-react";
import { Footer } from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

async function fetchFeaturedBooks() {
  const response = await fetch(
    `${API_BASE_URL}/classes/Book?limit=8&order=-createdAt&include=category,genres,owner`,
    {
      headers: HEADERS,
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar livros em destaque.");
  }

  const data = await response.json();
  return data.results;
}

export default function Home() {
  const router = useRouter();

  const booksQuery = useQuery({
    queryKey: ["featuredBooks"],
    queryFn: fetchFeaturedBooks,
  });

  const navigate = (path) => {
    router.push(path);
    setIsDropdownOpen(false);
  };

  let booksContent;

  if (booksQuery.isLoading) {
    booksContent = (
      <div className="text-center col-span-full">
        <p className="text-[#AF7026]">Carregando livros...</p>
      </div>
    );
  } else if (booksQuery.isError) {
    booksContent = (
      <div className="text-center col-span-full text-red-600">
        <p>Erro ao carregar os livros. Tente novamente mais tarde.</p>
        <p className="text-sm opacity-70">
          Detalhe: {booksQuery.error.message}
        </p>
      </div>
    );
  } else if (booksQuery.data && booksQuery.data.length > 0) {
    booksContent = booksQuery.data.map((book) => (
      <BookCard key={book.objectId} book={book} />
    ));
  } else {
    booksContent = (
      <div className="text-center col-span-full text-gray-500">
        <p>Nenhum livro em destaque encontrado no momento.</p>
        <p>Cadastre o primeiro livro!</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <section className="bg-[#AF7026] text-[#FFFFE3] py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">
            Compartilhe conhecimento!
            <span className="block text-4xl">
              Doe, empreste e receba livros
            </span>
          </h1>
          <p className="text-xl font-light w-3/4 mx-auto">
            Conecte-se com outros amantes da leitura e descubra novos mundos
            através da troca de livros.
          </p>

          <div className="pt-4 h-full w-full ">
            <Button
              size="xl"
              className={`bg-[#7D4D0B] hover:bg-[#6A4009] text-white`}
              onClick={() => navigate("/livros")}
            >
              Explorar
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-[#AF7026]`}>
            Livros populares
          </h2>
          <p className="text-muted-foreground text-lg">
            Descubra as últimas adições ao nosso catálogo
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {booksContent}
        </div>
      </section>

      <section className="bg-[#F7E4C6] py-16 border-t border-gray-200">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-12 text-[#AF7026]`}>
            Como Funciona
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          <div className="text-center space-y-3 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto bg-[#AF7026] rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">1. Cadastre-se</h3>
            <p className="text-muted-foreground text-sm">
              Crie sua conta gratuitamente e faça parte da comunidade Bookly.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto bg-[#AF7026] rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">2. Adicione Livros</h3>
            <p className="text-muted-foreground text-sm">
              Cadastre os livros que deseja doar ou emprestar para outros
              leitores.
            </p>
          </div>

          <div className="text-center space-y-3 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto bg-[#AF7026] rounded-full flex items-center justify-center">
              <Network className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">3. Conecte-se</h3>
            <p className="text-muted-foreground text-sm">
              Encontre livros de seu interesse e entre em contato com outros
              usuários.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
