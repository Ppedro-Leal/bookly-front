"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookFormModal } from "@/components/BookFormModal";
import { 
  Search, 
  LogOut, 
  MapPin, 
  Pencil, 
  Trash2, 
  Check, 
  X,
  Loader2,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/store/userAuthStore";

// --- VARIÁVEIS DE AMBIENTE E HEADERS ---
const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS_BASE = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

// --- FUNÇÕES DE FETCH ---

/** Busca livros doados pelo usuário (owner) */
async function fetchMinhasDoacoes(userId, sessionToken) {
  if (!userId || !sessionToken) return [];

  const whereClause = {
    owner: {
      __type: "Pointer",
      className: "_User",
      objectId: userId,
    },
  };

  const whereQuery = encodeURIComponent(JSON.stringify(whereClause));
  const url = `${API_BASE_URL}/classes/Book?where=${whereQuery}&include=state,category,genres&order=-createdAt`;

  try {
    const response = await fetch(url, {
      headers: {
        ...HEADERS_BASE,
        "X-Parse-Session-Token": sessionToken,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao buscar doações.");
    }

    return data.results.map((book) => ({
      id: book.objectId,
      capaUrl: book.cover?.url || "/placeholder-book.png",
      titulo: book.title || "Livro Desconhecido",
      author: book.author || "Autor Desconhecido",
      ano: book.year || 0,
      categoria: book.category?.name || "Sem Categoria",
      categoryObjectId: book.category?.objectId || "",
      generos: (book.genres?.results || []).map((g) => g.name || "N/A"),
      genreObjectIds: (book.genres?.results || []).map((g) => g.objectId),
      descricao: book.description || "Sem descrição",
      city: book.city || "N/A",
      cidade: book.city || "N/A",
      estado: book.state?.initials || "N/A",
      stateObjectId: book.state?.objectId || "",
      tipo: book.type || "Doação",
      preco: book.price || 0,
      cover: book.cover, // Objeto Parse File completo
    }));
  } catch (error) {
    console.error("Falha ao buscar doações:", error);
    throw error;
  }
}

/** Busca histórico de solicitações aceitas/recusadas onde o usuário é o owner */
async function fetchHistoricoDoacoes(userId, sessionToken) {
  if (!userId || !sessionToken) return [];

  const whereClause = {
    owner: {
      __type: "Pointer",
      className: "_User",
      objectId: userId,
    },
    status: {
      $in: ["aceito", "recusado"],
    },
  };

  const whereQuery = encodeURIComponent(JSON.stringify(whereClause));
  const url = `${API_BASE_URL}/classes/BookRequest?where=${whereQuery}&include=book,requester,book.state,book.category,book.genres&order=-updatedAt`;

  try {
    const response = await fetch(url, {
      headers: {
        ...HEADERS_BASE,
        "X-Parse-Session-Token": sessionToken,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao buscar histórico.");
    }

    return data.results.map((request) => ({
      id: request.objectId,
      capaUrl: request.book?.cover?.url || request.bookCover || "/placeholder-book.png",
      titulo: request.book?.title || request.bookTitle || "Livro Desconhecido",
      ano: request.book?.year || 0,
      categoria: request.book?.category?.name || "Sem Categoria",
      generos: (request.book?.genres?.results || []).map((g) => g.name || "N/A"),
      descricao: request.book?.description || "Sem descrição",
      cidade: request.book?.city || "N/A",
      estado: request.book?.state?.initials || "N/A",
      solicitante:
        request.requester?.nome ||
        request.requester?.username ||
        request.requesterName ||
        "Solicitante Desconhecido",
      status: request.status,
      data: new Date(request.updatedAt).toLocaleDateString("pt-BR"),
    }));
  } catch (error) {
    console.error("Falha ao buscar histórico:", error);
    throw error;
  }
}

/** Remove um livro */
async function deleteBook(bookId, sessionToken) {
  const response = await fetch(`${API_BASE_URL}/classes/Book/${bookId}`, {
    method: "DELETE",
    headers: {
      ...HEADERS_BASE,
      "X-Parse-Session-Token": sessionToken,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao remover livro.");
  }

  return response.json();
}

// --- COMPONENTE PRINCIPAL ---

export default function MinhasDoacoes() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  
  const userId = user?.objectId;
  const sessionToken = user?.sessionToken;
  const isLogged = !!userId && !!sessionToken;

  const [searchTerm, setSearchTerm] = useState("");
  const [bookToDelete, setBookToDelete] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Query: Minhas Doações
  const {
    data: doacoes = [],
    isLoading: isLoadingDoacoes,
    isError: isErrorDoacoes,
  } = useQuery({
    queryKey: ["minhasDoacoes", userId],
    queryFn: () => fetchMinhasDoacoes(userId, sessionToken),
    enabled: isLogged,
  });

  // Query: Histórico
  const {
    data: historico = [],
    isLoading: isLoadingHistorico,
    isError: isErrorHistorico,
  } = useQuery({
    queryKey: ["historicoDoacoes", userId],
    queryFn: () => fetchHistoricoDoacoes(userId, sessionToken),
    enabled: isLogged,
  });

  // Mutation: Remover Livro
  const deleteMutation = useMutation({
    mutationFn: (bookId) => deleteBook(bookId, sessionToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minhasDoacoes"] });
      setBookToDelete(null);
      alert("Livro removido com sucesso!");
    },
    onError: (error) => {
      alert("Erro ao remover livro: " + error.message);
    },
  });

  // Handlers
  const handleEditar = (doacao) => {
    setBookToEdit(doacao);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setBookToEdit(null);
  };

  const handleRemover = (doacao) => {
    setBookToDelete(doacao);
  };

  const confirmRemover = () => {
    if (bookToDelete) {
      deleteMutation.mutate(bookToDelete.id);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Filtros
  const filteredDoacoes = doacoes.filter(
    (d) =>
      d.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistorico = historico.filter(
    (h) =>
      h.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Redirect se não estiver logado
  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Por favor, faça login para acessar suas doações.</p>
          <Button onClick={() => router.push("/login")}>Ir para Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar>
        <Button variant="ghost" onClick={handleLogout} className="gap-2 shrink-0">
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </Navbar>

      <main className="container mx-auto px-6 py-8 grow">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Minhas Doações </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os livros que você disponibilizou para doação
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="doacoes" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="doacoes">
              Minhas Doações ({isLoadingDoacoes ? "..." : doacoes.length})
            </TabsTrigger>
            <TabsTrigger value="historico">
              Histórico ({isLoadingHistorico ? "..." : historico.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Minhas Doações */}
          <TabsContent value="doacoes">
            {isLoadingDoacoes ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            ) : isErrorDoacoes ? (
              <div className="text-center py-12 text-red-500">
                Erro ao carregar doações. Tente novamente.
              </div>
            ) : filteredDoacoes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card">
                {searchTerm
                  ? "Nenhuma doação encontrada com esse filtro."
                  : "Você ainda não possui livros cadastrados."}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoacoes.map((doacao) => (
                  <div
                    key={doacao.id}
                    className="bg-card border border-border rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Capa */}
                    <div className="shrink-0">
                      <img
                        src={doacao.capaUrl}
                        alt={`Capa de ${doacao.titulo}`}
                        className="w-28 h-40 object-cover rounded-lg shadow-md mx-auto md:mx-0"
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {doacao.titulo} {doacao.ano > 0 && `(${doacao.ano})`}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {doacao.categoria}
                        </p>
                      </div>

                      {/* Gêneros */}
                      {doacao.generos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {doacao.generos.map((genero, idx) => (
                            <Badge
                              key={`${genero}-${idx}`}
                              variant="secondary"
                              className="bg-secondary/20 text-secondary-foreground"
                            >
                              {genero}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Descrição */}
                      <p className="text-foreground text-sm line-clamp-2">
                        {doacao.descricao}
                      </p>

                      {/* Tipo e Preço */}
                      <div className="flex gap-3 items-center">
                        <Badge variant="outline">{doacao.tipo}</Badge>
                        {doacao.tipo === "Venda" && doacao.preco > 0 && (
                          <span className="font-bold text-[#AF7026]">
                            R$ {doacao.preco.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Localização */}
                    <div className="md:w-48 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {doacao.cidade} - {doacao.estado}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex md:flex-col gap-2 justify-center shrink-0">
                      <Button
                        onClick={() => handleEditar(doacao)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleRemover(doacao)}
                        variant="outline"
                        disabled={deleteMutation.isPending}
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
                      >
                        {deleteMutation.isPending && bookToDelete?.id === doacao.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Histórico */}
          <TabsContent value="historico">
            {isLoadingHistorico ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            ) : isErrorHistorico ? (
              <div className="text-center py-12 text-red-500">
                Erro ao carregar histórico. Tente novamente.
              </div>
            ) : filteredHistorico.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card">
                Nenhum histórico de solicitações encontrado.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistorico.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Capa */}
                    <div className="shrink-0">
                      <img
                        src={item.capaUrl}
                        alt={`Capa de ${item.titulo}`}
                        className="w-28 h-40 object-cover rounded-lg shadow-md mx-auto md:mx-0"
                      />
                    </div>

                    {/* Informações */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {item.titulo} {item.ano > 0 && `(${item.ano})`}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {item.categoria}
                        </p>
                      </div>

                      {/* Gêneros */}
                      {item.generos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.generos.map((genero, idx) => (
                            <Badge
                              key={`${genero}-${idx}`}
                              variant="secondary"
                              className="bg-secondary/20 text-secondary-foreground"
                            >
                              {genero}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Descrição */}
                      <p className="text-foreground text-sm line-clamp-2">
                        {item.descricao}
                      </p>
                    </div>

                    {/* Informações da Solicitação */}
                    <div className="md:w-48 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {item.cidade} - {item.estado}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Solicitante:</span>{" "}
                        {item.solicitante}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Data:</span> {item.data}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex md:flex-col gap-2 justify-center items-center shrink-0">
                      {item.status === "aceito" ? (
                        <Badge className="bg-green-600 text-white gap-1 px-4 py-2">
                          <Check className="h-4 w-4" />
                          Aceito
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive text-destructive-foreground gap-1 px-4 py-2">
                          <X className="h-4 w-4" />
                          Recusado
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Modal de Edição */}
      <BookFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        bookToEdit={bookToEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={!!bookToDelete} onOpenChange={() => setBookToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl">Confirmar Remoção</DialogTitle>
            </div>
            <DialogDescription className="pt-4">
              Tem certeza que deseja remover o livro{" "}
              <span className="font-semibold text-foreground">
                "{bookToDelete?.titulo}"
              </span>{" "}
              da sua lista de doações?
              <br />
              <br />
              <span className="text-red-600 font-medium">
                Esta ação não pode ser desfeita e o livro será permanentemente removido.
              </span>
            </DialogDescription>
          </DialogHeader>
          
          {bookToDelete && (
            <div className="py-4 border-t border-b my-2">
              <div className="flex gap-4 items-center">
                <img
                  src={bookToDelete.capaUrl}
                  alt={bookToDelete.titulo}
                  className="w-16 h-24 object-cover rounded shadow-md"
                />
                <div className="flex-1">
                  <p className="font-semibold">{bookToDelete.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {bookToDelete.categoria}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bookToDelete.cidade} - {bookToDelete.estado}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setBookToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmRemover}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Removendo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Sim, Remover
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}