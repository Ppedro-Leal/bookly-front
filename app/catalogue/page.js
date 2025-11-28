"use client";

import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { mockBooks } from "@/data/mockData";
import { useState, useMemo } from "react";

export default function Catalogo() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(() => {
    let filtered = mockBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    return filtered;
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Catálogo de Livros
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore nossa coleção completa de livros disponíveis para doação
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => console.log("Buscar:", searchQuery)}
              placeholder="Buscar por título, autor..."
            />
          </div>

          <div className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1
                ? "livro encontrado"
                : "livros encontrados"}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum livro encontrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Tente ajustar os termos da busca
            </p>
            <Button onClick={() => setSearchQuery("")}>Limpar Busca</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
