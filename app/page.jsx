"use client";

import { BookCard } from "../components/BookCard";
import { Navbar } from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { Button } from "../components/ui/button";
import { User, BookOpen, Handshake } from "lucide-react";
import { useState } from "react";
import { mockBooks } from "../data/mockData";
import { Footer } from "../components/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const featuredBooks = mockBooks.slice(0, 8);

  const primaryColor = "text-[#AF7026]";
  const buttonBgColor = "bg-[#7D4D0B] hover:bg-[#6A4009]";

  return (
    <div>
      <Navbar />

      <section className="bg-[#AF7026] text-white py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">
            Compartilhe conhecimento!
            <span className="block text-4xl">
              Doe, empreste e receba livros
            </span>
          </h1>
          <p className="text-xl font-light">
            Conecte-se com outros amantes da leitura e descubra novos mundos
            através da troca de livros.
          </p>

          <div className="pt-6 max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => console.log("Search:", searchQuery)}
            />
          </div>

          <div className="pt-4">
            <Button size="lg" className={`${buttonBgColor} text-white`}>
              Explorar
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${primaryColor}`}>
            Livros populares
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16 border-t border-gray-200">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-12 ${primaryColor}`}>
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
              <Handshake className="h-8 w-8 text-white" />
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
