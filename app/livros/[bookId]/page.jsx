"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Calendar, Tag, Library, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BookCard } from "@/components/BookCard";
import useAuthStore from "@/store/userAuthStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

async function fetchBookDetails(bookId) {
  if (!bookId) return null;

  const response = await fetch(`/api/book/${bookId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Livro não encontrado.");
  }

  return response.json();
}

async function createBookRequest(bookData, sessionToken) {
  const requestData = {
    book: {
      __type: "Pointer",
      className: "Book",
      objectId: bookData.bookId,
    },
    requester: {
      __type: "Pointer",
      className: "_User",
      objectId: bookData.requesterId,
    },
    owner: {
      __type: "Pointer",
      className: "_User",
      objectId: bookData.ownerId,
    },
    status: "pendente",
    bookTitle: bookData.bookTitle,
    bookCover: bookData.bookCover,
    requesterName: bookData.requesterName,
    ownerName: bookData.ownerName,
  };

  const response = await fetch(`${API_BASE_URL}/classes/BookRequest`, {
    method: "POST",
    headers: {
      ...HEADERS,
      "X-Parse-Session-Token": sessionToken,
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao criar solicitação.");
  }

  return response.json();
}

export default function BookDetailsPage() {
  const { bookId } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookDetails", bookId],
    queryFn: () => fetchBookDetails(bookId),
    enabled: !!bookId,
  });

  const owner = book?.owner;
  const ownerName = owner?.nome || owner?.username || "Usuário Bookly";

  const categoryId = book?.category?.objectId;
  const similarBooks = book?.similarBooks || [];

  const requestMutation = useMutation({
    mutationFn: ({ data, token }) => createBookRequest(data, token),
    onSuccess: () => {
      alert(
        "Solicitação enviada com sucesso! Você pode acompanhar o status em 'Pedidos'."
      );
      router.push("/pedidos");
    },
    onError: (error) => {
      alert("Erro ao enviar solicitação: " + error.message);
    },
  });

  const handleConfirmRequest = () => {
    setIsModalOpen(false);

    const requestData = {
      bookId: book.objectId,
      requesterId: user.objectId,
      ownerId: owner.objectId,
      bookTitle: book.title,
      bookCover: book.cover?.url || "/placeholder-book.png",
      requesterName: user.nome || user.username,
      ownerName: ownerName,
    };

    requestMutation.mutate({ data: requestData, token: user.sessionToken });
  };

  const handleRequestBook = () => {
    if (!user) {
      alert("Você precisa estar logado para solicitar um livro.");
      router.push("/prelogin");
      return;
    }
    if (!book) {
      alert("Erro: livro não encontrado.");
      return;
    }
    if (!owner || !owner.objectId) {
      alert("Erro: informações do doador não disponíveis.");
      console.error("Owner não encontrado:", owner);
      return;
    }
    if (user.objectId === owner.objectId) {
      alert("Você não pode solicitar seu próprio livro.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleContact = () => {
    if (!user) {
      alert("Você precisa estar logado para entrar em contato.");
      router.push("/prelogin");
      return;
    }

    if (!owner || !owner.email) {
      alert(
        "Email do doador não disponível. Por favor, use o sistema de solicitação."
      );
      return;
    }

    window.location.href = `mailto:${owner.email}?subject=Interesse no livro: ${book.title}`;
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-[#AF7026]">Carregando detalhes do livro...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (isError || !book) {
    return (
      <>
        <Navbar />
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-3xl text-red-600 font-bold mb-4">
            Erro ao Carregar
          </h1>
          <p className="text-gray-600">
            O livro que você está buscando não foi encontrado ou houve um erro
            na conexão.
          </p>
          {isError && (
            <p className="text-sm opacity-70 mt-2">Detalhe: {error.message}</p>
          )}
        </div>
        <Footer />
      </>
    );
  }

  const coverUrl = book.cover?.url || "/placeholder-book.png";
  const mainCategory = book.category?.name;
  const genres = book.genres?.results || [];
  const city = book.city;
  const stateName = book.state?.name;
  const stateInitials = book.state?.initials;
  const createdDate = new Date(book.createdAt).toLocaleDateString("pt-BR");

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#AF7026]">
          Detalhes do Livro
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="col-span-1 flex justify-center">
            <div className="w-full max-w-xs lg:max-w-none aspect-2/3 shadow-xl rounded-lg overflow-hidden">
              <Image
                src={coverUrl}
                alt={book.title}
                width={400}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <div className="space-y-2 border-b pb-4">
              <h2 className="text-4xl font-extrabold text-gray-900">
                {book.title}
              </h2>
              <p className="text-xl text-gray-600 font-medium">
                Por: {book.author || "Autor Desconhecido"}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Registrado em: {createdDate}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold border-b pb-2 text-gray-800">
                Categoria e Gêneros
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                {mainCategory && (
                  <Badge
                    variant="outline"
                    className="text-yellow-800 border-yellow-300 bg-yellow-50 text-base py-1 px-3"
                  >
                    <Library className="h-4 w-4 mr-2" />
                    {mainCategory}
                  </Badge>
                )}
                {genres.map((genre) => (
                  <Badge
                    key={genre.objectId}
                    variant="secondary"
                    className="text-base py-1 px-3 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                Sobre o Livro (Descrição)
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {book.description || "Descrição não fornecida."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-[#F7E4C6] p-8 rounded-xl shadow-lg border border-[#AF7026]">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Informações de Doação/Troca
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center relative border-2 border-[#AF7026] shrink-0">
                {owner?.avatar?.url ? (
                  <Image
                    src={owner.avatar.url}
                    alt={ownerName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-500" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900">
                  Doador: {ownerName}
                </p>
                {city && stateInitials && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {city} - {stateInitials}
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Disponibilidade:
                  <span className="font-medium text-green-600">
                    {book.type}
                  </span>
                  {book.type === "Venda" && book.price && (
                    <span className="ml-2 font-bold text-lg text-yellow-700">
                      R$ {book.price.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex justify-end md:justify-start space-x-4">
              <Button
                size="lg"
                onClick={handleContact}
                className="bg-[#7D4D0B] hover:bg-[#6A4009] text-white font-semibold shadow-md"
              >
                Entre em Contato!
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleRequestBook}
                disabled={requestMutation.isPending}
                className="border-2 border-[#7D4D0B] bg-[#FFFFFF] hover:bg-[#F7E4C6] text-[#7D4D0B] font-semibold shadow-md disabled:opacity-50"
              >
                {requestMutation.isPending ? "Enviando..." : "Solicitar Livro"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {similarBooks.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#AF7026]">
              Livros Semelhantes
            </h2>

            <p className="text-gray-500 mt-2">
              Outras obras na categoria "{book.category.name}"
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarBooks.map((similarBook) => (
              <BookCard key={similarBook.objectId} book={similarBook} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmação de Solicitação</DialogTitle>
            <DialogDescription>
              Você confirma que deseja solicitar o livro "{book.title}"? O
              doador será notificado e terá a opção de Aceitar ou Recusar o
              pedido.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="font-semibold">Livro:</p>
            <p>{book.title}</p>
            <p className="font-semibold">Doador:</p>
            <p>{ownerName}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmRequest}
              disabled={requestMutation.isPending}
            >
              {requestMutation.isPending
                ? "Enviando..."
                : "Confirmar Solicitação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
