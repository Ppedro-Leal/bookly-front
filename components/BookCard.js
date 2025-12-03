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
    <Card className="group overflow-hidden hover:shadow-xl bg-[#FFFFE3] transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden aspect-2/3">
        <img
          src={coverUrl || '/placeholder-book.png'} 
          alt={book.title}
          width={400} 
          height={600} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />


        <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge
                variant={book.type === "Venda" ? "default" : "secondary"}
                className="shadow-md bg-yellow-600 hover:bg-yellow-700 text-white"
            >
                {book.type}
            </Badge>
        </div>
      </div>

      <CardContent className="flex-1 p-4 space-y-3">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-yellow-700 transition-colors">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500">{book.author || 'Autor Desconhecido'}</p> 

        {mainCategory && (
            <div className="flex items-center gap-1 text-xs">
                <Badge variant="outline" className="text-yellow-800 border-yellow-300 bg-yellow-50">
                    <Library className="h-3 w-3 mr-1" />
                    {mainCategory}
                </Badge>
            </div>
        )}


        <div className="flex flex-wrap gap-1 items-center">
            {genres.slice(0, 3).map((genre) => (
                <Badge key={genre.objectId} variant="secondary" className="text-xs">
                    {genre.name}
                </Badge>
            ))}
            {genres.length > 3 && (
                <Badge variant="secondary" className="text-xs opacity-70">
                    +{genres.length - 3}
                </Badge>
            )}
        </div>
        
        {book.owner?.address && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{book.owner.address}</span> 
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full cursor-pointer" onClick={() => router.push(`/livros/${book.objectId}`)}>
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};