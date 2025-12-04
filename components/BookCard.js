// components/BookCard.js
// Card de livro usado na listagem. Navega para /details/[id] passando o objectId.

import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Library } from "lucide-react";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

export const BookCard = ({ book }) => {
  const router = useRouter();

  const coverUrl = book.cover?.url;
  const mainCategory = book.category?.name;
  const genres = book.genres?.results || [];

  return (
    <Card className="group overflow-hidden bg-[#FFFFE3] flex flex-col">
      <div className="relative aspect-2/3">
        <img
          src={coverUrl || "/placeholder-book.png"}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="flex-1 p-4 space-y-2">
        <h3 className="font-bold text-lg">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.author || "Autor Desconhecido"}</p>

        {mainCategory && (
          <Badge variant="outline" className="text-yellow-800 border-yellow-300 bg-yellow-50">
            <Library className="h-3 w-3 mr-1" /> {mainCategory}
          </Badge>
        )}

        {book.owner?.address && (
          <p className="flex items-center gap-1 text-xs text-gray-600">
            <MapPin className="h-3 w-3" /> {book.owner.address}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/details/${book.objectId}`)}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

