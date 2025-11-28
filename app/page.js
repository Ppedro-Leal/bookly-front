"use client";

import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Heart, Library, TrendingUp, Users, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { mockBooks } from "@/data/mockData";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userToken = localStorage.getItem("userToken");
      const userData = localStorage.getItem("userData");
      setIsLoggedIn(!!(userToken && userData));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleDoarLivro = () => {
    if (!isLoggedIn) {
      router.push("/prelogin?redirect=/forms");
      return;
    }

    router.push("/forms");
  };

  const handleExplorarCatalogo = () => {
    router.push("/catalogo");
  };

  return (
    <div>
      <Navbar />

      <section className="bg-white py-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold">
            Doe, receba ou descubra
            <span className="block text-yellow-600">novos livros</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Conecte-se com outros amantes de leitura, doe livros que já leu e
            encontre sua próxima leitura favorita gratuitamente.
          </p>

          <div className="pt-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => console.log("Buscar:", searchQuery)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" onClick={handleExplorarCatalogo}>
              <Library />
              Explorar Acervo
            </Button>

            <Button variant="outline" size="lg" onClick={handleDoarLivro}>
              <Gift />
              Doar um Livro
            </Button>
          </div>

          {!isLoggedIn && (
            <div className="text-sm text-muted-foreground mt-2">
              * É necessário estar logado para doar livros
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16 border-y px-32">
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto bg-yellow-600 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Doe com Carinho</h3>
            <p className="text-muted-foreground">
              Doe seus livros com amor e permita que outras pessoas descubram
              histórias incríveis sem custo algum.
            </p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto bg-yellow-600 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Comunidade Solidária</h3>
            <p className="text-muted-foreground">
              Faça parte de uma rede de leitores que acredita no poder de
              compartilhar conhecimento e entretenimento.
            </p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto bg-yellow-600 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Impacto Social</h3>
            <p className="text-muted-foreground">
              Promova o acesso à leitura e contribua para uma sociedade mais
              educada e culturalmente rica.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Livros Disponíveis para Doação
          </h2>
          <p className="text-muted-foreground text-lg">
            Encontre livros incríveis doados por nossa comunidade
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockBooks.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={handleExplorarCatalogo}>
            Ver Todos os Livros Disponíveis
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
