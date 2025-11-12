import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Tag } from "lucide-react";

export const BookCard = ({ book }) => {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden aspect-2/3">
        <img
          src={book.coverUrl}
          alt={book.title}
          width={100}
          height={20}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Badge
            variant={book.type === "Venda" ? "default" : "secondary"}
            className="shadow-md"
          >
            {book.type}
          </Badge>
          {book.type !== "Empréstimo" && book.price && (
            <Badge variant="outline" className="bg-card shadow-md">
              R$ {book.price.toFixed(2)}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="flex-1 p-4 space-y-2">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span>{book.genre}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{book.ownerCity}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};
