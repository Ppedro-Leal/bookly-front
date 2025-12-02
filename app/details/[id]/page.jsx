"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Tag,
  User,
  Calendar,
  MessageCircle,
  Heart,
  Mail,
  Star,
  BookOpen,
} from "lucide-react";
import { mockBooks, mockUsers } from "@/data/mockData";
import { useParams } from "next/navigation";

export default function DetalhesLivro() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id;

  const livro = mockBooks.find((book) => book.id === bookId);

  if (!livro) {
    router.push("/catalogo");
    return null;
  }

  const doador = mockUsers.find((user) => user.id === livro.ownerId);

  const handleChat = () => {
    const isLoggedIn = localStorage.getItem("userToken");
    if (!isLoggedIn) {
      router.push("/prelogin?redirect=/chat");
      return;
    }
    router.push("/chat");
  };

  const handleVoltar = () => {
    router.back();
  };

  const livrosDoDoador = mockBooks.filter(
    (book) => book.ownerId === livro.ownerId
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header com Botão Voltar */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleVoltar}
            className="flex items-center gap-2 hover:bg-white hover:shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Catálogo
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Coluna da Esquerda - Imagem e Badges */}
            <div className="space-y-6">
              {/* Imagem do Livro com Efeito */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={livro.coverUrl}
                    alt={livro.title}
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Badges Informativos */}
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
                >
                  <Tag className="h-4 w-4" />
                  {livro.genre}
                </Badge>
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium border-amber-200 bg-amber-50 text-amber-800"
                >
                  <Calendar className="h-4 w-4" />
                  {livro.year}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-2 text-sm font-medium border-blue-200 bg-blue-50 text-blue-800"
                >
                  {livro.condition}
                </Badge>
                <Badge className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm font-medium text-white">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Doação Gratuita
                </Badge>
              </div>

              {/* Informações Adicionais */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                    <Star className="h-5 w-5 text-amber-500" />
                    Sobre o Livro
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium">Gênero</span>
                      <span className="text-gray-800">{livro.genre}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium">Ano</span>
                      <span className="text-gray-800">{livro.year}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Condição</span>
                      <span className="text-gray-800">{livro.condition}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna da Direita - Conteúdo */}
            <div className="space-y-8">
              {/* Cabeçalho do Livro */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    {livro.title}
                  </h1>
                  <p className="text-xl text-gray-600 mt-2 font-light">
                    por{" "}
                    <span className="font-semibold text-gray-800">
                      {livro.author}
                    </span>
                  </p>
                </div>

                {/* Descrição */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">
                      Sinopse
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg font-light">
                      {livro.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Card do Doador */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={doador?.photoUrl}
                        alt={doador?.name}
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {doador?.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{doador?.city}</span>
                      </div>
                    </div>
                  </div>

                  {doador?.bio && (
                    <div className="mb-4">
                      <p className="text-gray-700 italic text-lg leading-relaxed border-l-4 border-amber-400 pl-4 py-2 bg-white/50 rounded-r-lg">
                        {doador.bio}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600 bg-white/50 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-500" />
                      <span className="font-semibold text-gray-800">
                        {livrosDoDoador} livro{livrosDoDoador !== 1 ? "s" : ""}{" "}
                        disponível{livrosDoDoador !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">{doador?.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ação Principal */}
              <div className="space-y-4">
                <Button className="w-full" size="lg" onClick={handleChat}>
                  <MessageCircle className="h-6 w-6 mr-3" />
                  Conversar com {doador?.name?.split(" ")[0]}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium">
                    📚 Combine a retirada diretamente com o doador
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
