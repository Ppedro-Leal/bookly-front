"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  ChevronDown,
  ChevronUp,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import useAuthStore from "@/store/userAuthStore";
import { useRouter } from "next/navigation";

// --- VARIÁVEIS DE AMBIENTE E HEADERS ---
const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS_BASE = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

// --- FUNÇÕES DE FETCH ---

/** Busca pedidos ATIVOS (Status: 'pendente') da classe BookRequest */
async function fetchPedidosAtivos(userId, sessionToken) {
  if (!userId || !sessionToken) return [];

  const whereClause = {
    requester: {
      __type: "Pointer",
      className: "_User",
      objectId: userId,
    },
    status: "pendente",
  };

  const whereQuery = encodeURIComponent(JSON.stringify(whereClause));
  const url = `${API_BASE_URL}/classes/BookRequest?where=${whereQuery}&include=book,book.owner,book.state,book.category,book.genres&order=-createdAt`;

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
      throw new Error(data.error || "Erro ao buscar pedidos ativos.");
    }

    return data.results.map((r) => ({
      id: r.objectId,
      capaUrl: r.book?.cover?.url || r.bookCover || "/placeholder-book.png",
      titulo: r.book?.title || r.bookTitle || "Livro Desconhecido",
      ano: r.book?.year || 0,
      doador: r.book?.owner?.nome || r.book?.owner?.username || r.ownerName || "Doador Anônimo",
      status: r.status,
      categorias: (r.book?.genres?.results || []).map((g) => g.name || "N/A"),
      data: new Date(r.createdAt).toLocaleDateString("pt-BR"),
    }));

  } catch (error) {
    console.error("Falha ao buscar pedidos ativos:", error);
    throw error;
  }
}

/** Busca pedidos do HISTÓRICO (Status: 'aceito' ou 'recusado') da classe BookRequest */
async function fetchHistorico(userId, sessionToken) {
  if (!userId || !sessionToken) return [];

  const whereClause = {
    requester: {
      __type: "Pointer",
      className: "_User",
      objectId: userId,
    },
    status: {
      $in: ["aceito", "recusado"]
    }
  };

  const whereQuery = encodeURIComponent(JSON.stringify(whereClause));
  const url = `${API_BASE_URL}/classes/BookRequest?where=${whereQuery}&include=book,book.owner,book.state,book.category,book.genres&order=-updatedAt`;

  try {
    const response = await fetch(url, {
      headers: { 
        ...HEADERS_BASE, 
        "X-Parse-Session-Token": sessionToken 
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao buscar histórico.");
    }

    return data.results.map((r) => ({
      id: r.objectId,
      capaUrl: r.book?.cover?.url || r.bookCover || "/placeholder-book.png",
      titulo: r.book?.title || r.bookTitle || "Livro Desconhecido",
      ano: r.book?.year || 0,
      doador: r.book?.owner?.nome || r.book?.owner?.username || r.ownerName || "Doador Anônimo",
      status: r.status,
      categorias: (r.book?.genres?.results || []).map((g) => g.name || "N/A"),
      data: new Date(r.updatedAt).toLocaleDateString("pt-BR"),
    }));
  } catch (error) {
    console.error("Falha ao buscar histórico:", error);
    throw error;
  }
}

// --- COMPONENTE CARD & HELPERS DE VISUALIZAÇÃO ---

const getStatusDetails = (status) => {
  switch (status) {
    case "pendente":
      return {
        text: "Pendente",
        color: "text-yellow-600 font-bold",
        icon: Clock,
      };
    case "recusado":
      return {
        text: "Recusado",
        color: "text-red-600 font-bold",
        icon: XCircle,
      };
    case "aceito":
      return {
        text: "Aceito",
        color: "text-green-600 font-bold",
        icon: CheckCircle,
      };
    default:
      return {
        text: "Desconhecido",
        color: "text-gray-500",
        icon: Clock,
      };
  }
};

const PedidoCard = ({ pedido }) => {
  const statusDetails = getStatusDetails(pedido.status);

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow relative">
      <span className="absolute top-2 right-3 text-xs text-muted-foreground">
        {pedido.data}
      </span>
      <img
        src={pedido.capaUrl}
        alt={`Capa de ${pedido.titulo}`}
        className="w-16 h-24 object-cover rounded-lg shadow-sm"
      />
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-foreground">
          {pedido.titulo} {pedido.ano > 0 && `(${pedido.ano})`}
        </h3>
        <p className="text-sm text-muted-foreground">
          Doador: <span className="text-primary">{pedido.doador}</span>
        </p>
        <p className="text-sm flex items-center gap-1">
          <statusDetails.icon className={`h-4 w-4 ${statusDetails.color}`} />
          Status: <span className={statusDetails.color}>{statusDetails.text}</span>
        </p>
        {pedido.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {pedido.categorias.map((cat, idx) => (
              <Badge
                key={`${cat}-${idx}`}
                variant="secondary"
                className="text-xs bg-primary/20 text-primary-foreground hover:bg-primary/30"
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function MeusPedidos() {
  const { user, logout } = useAuthStore();
  const router = useRouter(); 
  const isLogged = !!user?.objectId;
  const userId = user?.objectId;
  const sessionToken = user?.sessionToken;

  const [recentesOpen, setRecentesOpen] = useState(true);
  const [historicoOpen, setHistoricoOpen] = useState(true); 

  // 1. Busca Pedidos Ativos (BookRequest com status=pendente)
  const {
    data: pedidosAtivos = [],
    isLoading: isLoadingAtivos,
    isError: isErrorAtivos,
  } = useQuery({
    queryKey: ["pedidosAtivos", userId],
    queryFn: () => fetchPedidosAtivos(userId, sessionToken),
    enabled: isLogged && !!sessionToken,
  }); 

  // 2. Busca Histórico (BookRequest com status=aceito ou recusado)
  const {
    data: historico = [],
    isLoading: isLoadingHistorico,
    isError: isErrorHistorico,
  } = useQuery({
    queryKey: ["historicoPedidos", userId],
    queryFn: () => fetchHistorico(userId, sessionToken),
    enabled: isLogged && !!sessionToken,
  }); 

  // Renderiza o conteúdo (Loading, Erro, Vazio ou Dados)
  const renderContent = (data, isLoading, isError, title) => {
    if (!isLogged) {
      return (
        <div className="text-center py-12 text-blue-500 border border-blue-300 rounded-lg bg-blue-50">
          Por favor, faça login para ver seus {title.toLowerCase()}.
          <Button
            onClick={() => router.push("/login")}
            className="mt-4 bg-[#AF7026] hover:bg-[#7D4D0B]"
          >
            Ir para Login
          </Button>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      );
    }
    if (isError) {
      return (
        <div className="text-center py-12 text-red-500 border border-red-300 rounded-lg bg-red-50">
          Ocorreu um erro ao carregar os {title.toLowerCase()}. Tente novamente.
        </div>
      );
    }
    if (data.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card">
          Nenhum {title.toLowerCase()} encontrado.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {data.map((pedido) => (
          <PedidoCard key={pedido.id} pedido={pedido} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar>
        <Button variant="ghost" onClick={logout} className="gap-2 shrink-0">
          <LogOut className="h-5 w-5" /> Sair
        </Button>
      </Navbar>

      <main className="container mx-auto px-6 py-8 grow">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground">
            Meus Pedidos de Livros
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe o status das suas solicitações ativas e veja seu histórico de empréstimos.
          </p>
        </div>

        {/* Pedidos Ativos (BookRequest com status=pendente) */}
        <Collapsible
          open={recentesOpen}
          onOpenChange={setRecentesOpen}
          className="mb-8"
        >
          <CollapsibleTrigger className="flex items-center justify-center gap-2 w-full mb-4">
            <h2 className="text-xl font-semibold text-primary underline underline-offset-4">
              Pedidos Ativos ({isLoadingAtivos ? "..." : pedidosAtivos.length})
            </h2>
            {recentesOpen ? (
              <ChevronUp className="h-5 w-5 text-primary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-primary" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {renderContent(
              pedidosAtivos,
              isLoadingAtivos,
              isErrorAtivos,
              "Pedidos Ativos"
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Histórico (BookRequest com status=aceito ou recusado) */}
        <Collapsible open={historicoOpen} onOpenChange={setHistoricoOpen}>
          <CollapsibleTrigger className="flex items-center justify-center gap-2 w-full mb-4">
            <h2 className="text-xl font-semibold text-primary underline underline-offset-4">
              Histórico ({isLoadingHistorico ? "..." : historico.length})
            </h2>
            {historicoOpen ? (
              <ChevronUp className="h-5 w-5 text-primary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-primary" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {renderContent(
              historico,
              isLoadingHistorico,
              isErrorHistorico,
              "Histórico"
            )}
          </CollapsibleContent>
        </Collapsible>
      </main>

      <Footer />
    </div>
  );
}   