import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Tag } from "lucide-react";
import { Badge } from "./ui/badge";

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
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};