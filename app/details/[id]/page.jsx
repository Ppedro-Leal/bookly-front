"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function DetalhesLivro() {
  const params = useParams();
  const bookId = params?.id;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => history.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>

        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Detalhes do Livro</h1>
            <p>ID do livro: {bookId}</p>
            <p>Aqui você pode renderizar título, autor, capa e demais informações.</p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
