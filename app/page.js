"use client";

import { Navbar } from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Empreste, venda ou descubra
            <span className="block text-yellow-600">novos livros</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Conecte-se com outros amantes de livros, compartilhe sua biblioteca
            e encontre sua próxima leitura favorita.
          </p>

          <div className="pt-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => console.log("Search:", searchQuery)}
            />
          </div>

          {/* <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/catalogo">
              <Button variant="hero" size="lg">
                <BookOpen className="mr-2" />
                Explorar Catálogo
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg">
                Cadastrar Meu Livro
              </Button>
            </Link>
          </div> */}
        </div>
      </section>
    </div>
  );
}
