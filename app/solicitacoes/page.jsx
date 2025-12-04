"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/userAuthStore";
import { Navbar } from "@/components/Navbar";
import SolicitacaoItem from "@/components/solicitacaoItem";
import { Footer } from "@/components/Footer";
import { LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS_BASE = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

async function fetchSolicitations(ownerId, sessionToken) {
  if (!ownerId || !sessionToken) return [];

  const whereClause = {
    owner: {
      __type: "Pointer",
      className: "_User",
      objectId: ownerId,
    },
    status: "pendente",
  };

  const whereQuery = encodeURIComponent(JSON.stringify(whereClause));
  const url = `${API_BASE_URL}/classes/BookRequest?where=${whereQuery}&include=book,requester,book.state,book.category,book.genres&order=-createdAt`;

  const response = await fetch(url, {
    headers: {
      ...HEADERS_BASE,
      "X-Parse-Session-Token": sessionToken,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar solicitações.");
  }

  const data = await response.json();
  return data.results;
}

async function updateSolicitationStatus(
  solicitationId,
  newStatus,
  sessionToken
) {
  const response = await fetch(
    `${API_BASE_URL}/classes/BookRequest/${solicitationId}`,
    {
      method: "PUT",
      headers: {
        ...HEADERS_BASE,
        "X-Parse-Session-Token": sessionToken,
      },
      body: JSON.stringify({ status: newStatus }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error ||
        `Erro ao ${newStatus === "aceito" ? "aceitar" : "recusar"} solicitação.`
    );
  }

  return response.json();
}

const Solicitacoes = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  const ownerId = user?.objectId;
  const sessionToken = user?.sessionToken;

  const {
    data: solicitacoes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookRequests", ownerId],
    queryFn: () => fetchSolicitations(ownerId, sessionToken),
    enabled: !!ownerId && !!sessionToken,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      updateSolicitationStatus(id, status, sessionToken),
    onSuccess: (data, variables) => {
      alert(`Solicitação ${variables.status} com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ["bookRequests"] });
    },
    onError: (error) => {
      alert("Erro ao processar solicitação: " + error.message);
    },
  });

  const handleAceitar = (id) => {
    if (confirm("Tem certeza que deseja aceitar esta solicitação?")) {
      statusMutation.mutate({ id, status: "aceito" });
    }
  };

  const handleRecusar = (id) => {
    if (confirm("Tem certeza que deseja recusar esta solicitação?")) {
      statusMutation.mutate({ id, status: "recusado" });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const filteredSolicitacoes = solicitacoes.filter(
    (s) =>
      (s.book?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.requester?.username || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const isMutating = statusMutation.isPending;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
             
        <p>
                    Acesso negado. Por favor,        
          <Button onClick={() => router.push("/login")}>faça login</Button>.    
           
        </p>
           
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
                <p className="text-secondary">Carregando solicitações...</p>   
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
             
        <p className="text-destructive">
                    Erro ao carregar solicitações. Tente novamente.      
        </p>
           
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar>
             
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="gap-2 shrink-0"
        >
                    <LogOut className="h-5 w-5" /> Sair      
        </Button>
           
      </Navbar>
                     
      <main className="container mx-auto px-6 py-8 grow">
                     
        <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
                    Solicitações de Livros Pendentes      
        </h1>
                           
        <div className="relative mb-8 max-w-lg mx-auto">
                 
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 
          <Input
            type="text"
            placeholder="Buscar por título do livro ou nome do solicitante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg shadow-sm focus-visible:ring-primary"
          />
               
        </div>
             
        <div className="space-y-4">
                                     
          {filteredSolicitacoes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card">
                                          Nenhuma solicitação pendente
              encontrada.                                    
            </div>
          ) : (
            filteredSolicitacoes.map((s) => (
              <SolicitacaoItem
                key={s.objectId}
                s={s}
                handleAceitar={handleAceitar}
                handleRecusar={handleRecusar}
                isMutating={isMutating}
                sessionToken={sessionToken}
              />
            ))
          )}
                                 
        </div>
                         
      </main>
            <Footer /> 
    </div>
  );
};

export default Solicitacoes;
