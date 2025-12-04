import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, Check, X, Library } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS_BASE = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

async function fetchGenresByRelation(bookId, sessionToken) {
  const relatedToQuery = {
    $relatedTo: {
      object: {
        __type: "Pointer",
        className: "Book",
        objectId: bookId,
      },
      key: "genres",
    },
  };

  const whereQuery = encodeURIComponent(JSON.stringify(relatedToQuery));

  const finalUrl = `${API_BASE_URL}/classes/Genre?where=${whereQuery}&limit=3`;

  const response = await fetch(finalUrl, {
    method: "GET",
    headers: {
      ...HEADERS_BASE,
      "X-Parse-Session-Token": sessionToken,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Fetch Error:", error);
    throw new Error(
      error.error || "Erro ao buscar gêneros (Relational Query)."
    );
  }

  const data = await response.json();
  return data.results;
}

const SolicitacaoItem = ({
  s,
  handleAceitar,
  handleRecusar,
  isMutating,
  sessionToken,
}) => {
  const { data: genres = [], isLoading: isLoadingGenres } = useQuery({
    queryKey: ["bookGenres", s.book.objectId],
    queryFn: () => fetchGenresByRelation(s.book.objectId, sessionToken),
    enabled: !!s.book?.objectId,
  });
  return (
    <div
      key={s.objectId}
      className="bg-card border border-border rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-lg transition-shadow"
    >
      <div className="shrink-0">
        <img
          src={s.book?.cover?.url || s.bookCover || "/placeholder-book.png"}
          alt={`Capa de ${s.bookTitle}`}
          className="w-28 h-40 object-cover rounded-lg shadow-md mx-auto md:mx-0"
        />
      </div>

      <div className="flex-1 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">{s.bookTitle}</h2>
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-1 mt-1">
            <Library className="h-4 w-4 text-primary" />
            Categoria Principal: {s.book?.category?.name || "Desconhecida"}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {isLoadingGenres ? (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-100 text-gray-500"
              >
                Carregando Gêneros...
              </Badge>
            ) : (
              genres.slice(0, 3).map((g) => (
                <Badge
                  key={g.objectId}
                  variant="secondary"
                  className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                >
                  {g.name}
                </Badge>
              ))
            )}
          </div>
        </div>

        <p className="text-foreground text-sm flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <span className="font-semibold">Solicitante:</span> {s.requesterName}
        </p>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="h-4 w-4" />
          <span>
            {s.book?.city || "Cidade Desconhecida"} -{" "}
            {s.book?.state?.initials ||
              s.book?.state?.name ||
              "Estado Desconhecida"}
          </span>
        </div>
      </div>

      <div className="flex md:flex-col gap-2 justify-center shrink-0">
        <Button
          onClick={() => handleAceitar(s.objectId)}
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
          disabled={isMutating}
        >
          <Check className="h-4 w-4" />
          Aceitar
        </Button>
        <Button
          variant="outline"
          onClick={() => handleRecusar(s.objectId)}
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
          disabled={isMutating}
        >
          <X className="h-4 w-4" />
          Recusar
        </Button>
      </div>
    </div>
  );
};

export default SolicitacaoItem;
