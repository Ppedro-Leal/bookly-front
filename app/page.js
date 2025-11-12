"use client";

import { Navbar } from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Heart, Library, Plus, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Navbar />

      <section className="bg-white py-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold">
            Empreste, venda ou descubra
            <span className="block text-yellow-600">novos livros</span>
          </h1>
          <p className="text-xl text-muted-foreground">
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

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg">
              <Library />
              Explorar Catálogo
            </Button>
            <Button variant="outline" size="lg">
              <Plus />
              Cadastrar Meu Livro
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-white py-16 border-y px-32">
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto bg-yellow-600 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Compartilhe a Leitura</h3>
            <p className="text-muted-foreground">
              Empreste seus livros favoritos e ajude outros leitores a
              descobrirem novas histórias.
            </p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto bg-yellow-600 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Comunidade Ativa</h3>
            <p className="text-muted-foreground">
              Conecte-se com leitores da sua região e forme uma rede de troca de
              livros.
            </p>
          </div>

          <div className="text-center space-y-3 p-6">
            <div className="w-16 h-16 mx-auto bg-yellow-600 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Sustentável</h3>
            <p className="text-muted-foreground">
              Dê uma segunda vida aos livros e contribua para um consumo mais
              consciente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
