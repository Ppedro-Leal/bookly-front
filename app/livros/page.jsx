"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Library,
  Filter,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/classes/Category`, {
    headers: HEADERS,
  });
  if (!response.ok) throw new Error("Erro ao buscar categorias.");
  const data = await response.json();
  return data.results.map((cat) => ({
    objectId: cat.objectId,
    name: cat.name,
  }));
}

async function fetchGenres() {
  const response = await fetch(`${API_BASE_URL}/classes/Genre`, {
    headers: HEADERS,
  });
  if (!response.ok) throw new Error("Erro ao buscar gêneros.");
  const data = await response.json();
  return data.results.map((gen) => ({
    objectId: gen.objectId,
    name: gen.name,
  }));
}

async function fetchBooks(filters) {
  const { searchQuery, selectedCategory, selectedGenres, bookType } = filters;
  let where = {};

  if (searchQuery) {
    where.title = { $regex: searchQuery, $options: "i" };
  }
  if (selectedCategory) {
    where.category = {
      __type: "Pointer",
      className: "Category",
      objectId: selectedCategory,
    };
  }
  if (bookType) {
    where.type = bookType;
  }
  if (selectedGenres && selectedGenres.length > 0) {
    where.genres = {
      $inQuery: {
        where: { objectId: { $in: selectedGenres } },
        className: "Genre",
      },
    };
  }

  const includeFields = "category,owner,genres";
  const queryString = `where=${JSON.stringify(where)}&include=${includeFields}`;
  const url = `${API_BASE_URL}/classes/Book?${queryString}`;
  const response = await fetch(url, { headers: HEADERS });

  if (!response.ok) {
    const error = await response.json();
    console.error("Back4App Query Error:", error);
    throw new Error(error.error || "Erro ao buscar livros.");
  }

  const data = await response.json();
  return data.results;
}

const MobileFilterDialog = ({
  isFilterOpen,
  setIsFilterOpen,
  categoriesQuery,
  genresQuery,
  bookType,
  setBookType,
  selectedCategory,
  setSelectedCategory,
  selectedGenres,
  handleGenreChange,
  handleClearAllFilters,
}) => {
  const [openSection, setOpenSection] = useState({
    type: true,
    category: false,
    genres: false,
  });

  if (!isFilterOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-60 flex flex-col p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-3 sticky top-0 bg-white z-10">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Filter className="w-6 h-6 text-yellow-800" /> Filtros
        </h3>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFilterOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="space-y-4 flex-1 pb-4">
        <div className="border rounded-lg">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() =>
              setOpenSection({ ...openSection, type: !openSection.type })
            }
          >
            <h4 className="font-semibold text-lg text-yellow-800">
              Tipo de Negócio
            </h4>

            {openSection.type ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
          {openSection.type && (
            <div className="flex flex-wrap gap-2 p-4 border-t">
              {["Doação"].map((type) => (
                <Button
                  key={type}
                  variant={bookType === type ? "default" : "outline"}
                  className={
                    bookType === type
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "text-gray-700"
                  }
                  onClick={() => setBookType(bookType === type ? null : type)}
                  size="sm"
                >
                  {type}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="border rounded-lg">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() =>
              setOpenSection({
                ...openSection,
                category: !openSection.category,
              })
            }
          >
            <h4 className="font-semibold text-lg text-yellow-800">
              Categoria Principal
            </h4>

            {openSection.category ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
          {openSection.category && (
            <div className="space-y-2 p-4 border-t max-h-60 overflow-y-auto">
              {categoriesQuery.data?.map((cat) => (
                <label
                  key={cat.objectId}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.objectId}
                    onChange={() => setSelectedCategory(cat.objectId)}
                    className="h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                  />
                  <span className="text-base text-gray-700">{cat.name}</span>
                </label>
              ))}

              <Button
                variant="link"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="pl-0 pt-2 text-red-500 hover:text-red-700"
              >
                Limpar Categoria
              </Button>
            </div>
          )}
        </div>

        <div className="border rounded-lg">
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() =>
              setOpenSection({ ...openSection, genres: !openSection.genres })
            }
          >
            <h4 className="font-semibold text-lg text-yellow-800">Gêneros</h4>
            {openSection.genres ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {openSection.genres && (
            <div className="space-y-2 p-4 border-t max-h-60 overflow-y-auto">
              {genresQuery.data?.map((gen) => (
                <label
                  key={gen.objectId}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(gen.objectId)}
                    onChange={() => handleGenreChange(gen.objectId)}
                    className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-base text-gray-700">{gen.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t sticky bottom-0 bg-white flex flex-col gap-2">
        <Button
          variant="default"
          onClick={() => setIsFilterOpen(false)}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          Aplicar Filtros (e Fechar)
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            handleClearAllFilters();
            setIsFilterOpen(false);
          }}
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
        >
          Limpar Todos
        </Button>
      </div>
    </div>
  );
};

// Componente Principal da Página ---

export default function LivrosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [bookType, setBookType] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleGenreChange = useCallback((objectId) => {
    setSelectedGenres((prev) =>
      prev.includes(objectId)
        ? prev.filter((id) => id !== objectId)
        : [...prev, objectId]
    );
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedGenres([]);
    setBookType(null);
    setSearchQuery("");
  }, []);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
  const genresQuery = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: Infinity,
  });

  const filters = {
    searchQuery,
    selectedCategory,
    selectedGenres,
    bookType,
  };

  const booksQuery = useQuery({
    queryKey: ["books", filters],
    queryFn: () => fetchBooks(filters),
  });

  const books = booksQuery.data || [];

  if (categoriesQuery.isLoading || genresQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-yellow-600">Carregando filtros...</p>
      </div>
    );
  }

  if (categoriesQuery.isError || genresQuery.isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>Erro ao carregar categorias e gêneros.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-yellow-700 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-white space-y-4 mb-8">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Library className="h-8 w-8" /> Livros para Doação
            </h1>

            <p className="text-lg">
              Pesquise, filtre e encontre a sua próxima leitura.
            </p>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={() => booksQuery.refetch()}
          />
        </div>
      </section>
      <main className="container mx-auto px-4 max-w-7xl flex-1 py-12">
        <div className="md:hidden mb-6">
          <Button
            onClick={() => setIsFilterOpen(true)}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            <Filter className="w-5 h-5 mr-2" /> Abrir Filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <aside className="hidden md:block md:col-span-1 space-y-8 p-4 bg-gray-50 border rounded-lg h-fit sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
              <Filter className="w-5 h-5" /> Filtros
            </h3>

            <div>
              <h4 className="font-semibold mb-3 text-lg text-yellow-800">
                Tipo de Negócio
              </h4>

              <div className="flex flex-wrap gap-2">
                {["Doação"].map((type) => (
                  <Button
                    key={type}
                    variant={bookType === type ? "default" : "outline"}
                    className={
                      bookType === type
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "text-gray-700"
                    }
                    onClick={() => setBookType(bookType === type ? null : type)}
                    size="sm"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-lg text-yellow-800">
                Categoria Principal
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categoriesQuery.data?.map((cat) => (
                  <label
                    key={cat.objectId}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.objectId}
                      onChange={() => setSelectedCategory(cat.objectId)}
                      className="h-4 w-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </label>
                ))}

                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="pl-0 pt-2 text-red-500 hover:text-red-700"
                >
                  Limpar Categoria
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-lg text-yellow-800">
                Gêneros
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {genresQuery.data?.map((gen) => (
                  <label
                    key={gen.objectId}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(gen.objectId)}
                      onChange={() => handleGenreChange(gen.objectId)}
                      className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />

                    <span className="text-sm text-gray-700">{gen.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleClearAllFilters}
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
            >
              Limpar Todos os Filtros
            </Button>
          </aside>
          <section className="md:col-span-3">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {booksQuery.isLoading
                  ? "Buscando..."
                  : `${books.length} Livros Encontrados`}
              </h2>
              <div className="hidden md:flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5" /> Exibindo {books.length} resultados
              </div>
            </div>

            {booksQuery.isLoading ? (
              <div className="text-center py-20">
                <p className="text-xl text-yellow-600">
                  Buscando livros no catálogo...
                </p>
              </div>
            ) : booksQuery.isError ? (
              <div className="text-center py-20 bg-red-50 rounded-lg border border-dashed border-red-300">
                <p className="text-xl text-red-600">Erro ao carregar livros.</p>
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {books.map((book) => (
                  <BookCard key={book.objectId} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-xl text-gray-500">
                  Nenhum livro encontrado com os filtros aplicados.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {isFilterOpen && (
        <MobileFilterDialog
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          categoriesQuery={categoriesQuery}
          genresQuery={genresQuery}
          bookType={bookType}
          setBookType={setBookType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGenres={selectedGenres}
          handleGenreChange={handleGenreChange}
          handleClearAllFilters={handleClearAllFilters}
        />
      )}
      <Footer />
    </div>
  );
}
