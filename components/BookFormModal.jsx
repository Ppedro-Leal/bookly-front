"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, X, Loader2 } from "lucide-react";
import useAuthStore from "@/store/userAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;
const HEADERS = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
  "Content-Type": "application/json",
};

// --- FUNÇÕES DE FETCH ---
async function fetchStates() {
  const response = await fetch(`${API_BASE_URL}/classes/State`, {
    headers: HEADERS,
  });
  if (!response.ok) throw new Error("Erro ao buscar estados.");
  const data = await response.json();
  return data.results.map((state) => ({
    objectId: state.objectId,
    nome: state.nome,
  }));
}

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

async function uploadFileToBack4App(file, sessionToken) {
  if (!file) throw new Error("Nenhum arquivo de capa selecionado.");
  if (!sessionToken) throw new Error("Usuário não autenticado para upload.");

  const uploadHeaders = {
    "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
    "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
    "Content-Type": file.type,
    "X-Parse-Session-Token": sessionToken,
  };

  const response = await fetch(`${API_BASE_URL}/files/${file.name}`, {
    method: "POST",
    headers: uploadHeaders,
    body: file,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao fazer upload da capa.");
  }

  return response.json();
}

// --- FUNÇÃO DE EDIÇÃO ---
async function updateBookOnBack4App(bookId, bookData, sessionToken) {
  if (!sessionToken) throw new Error("Usuário não autenticado.");

  const {
    title,
    author,
    description,
    genreObjectIds,
    categoryObjectId,
    type,
    cover,
    city,
    stateObjectId,
  } = bookData;

  // 1. Atualizar dados principais
  const body = {
    title: title,
    author: author,
    type: type,
    cover: cover,
    category: {
      __type: "Pointer",
      className: "Category",
      objectId: categoryObjectId,
    },
    city: city,
    state: {
      __type: "Pointer",
      className: "State",
      objectId: stateObjectId,
    },
    description: description || null,
  };

  const bookResponse = await fetch(`${API_BASE_URL}/classes/Book/${bookId}`, {
    method: "PUT",
    headers: { ...HEADERS, "X-Parse-Session-Token": sessionToken },
    body: JSON.stringify(body),
  });

  if (!bookResponse.ok) {
    const error = await bookResponse.json();
    throw new Error(error.error || "Erro ao atualizar livro.");
  }

  const updatedBook = await bookResponse.json();

  // 2. Atualizar Relação de Gêneros
  if (genreObjectIds && genreObjectIds.length > 0) {
    const genreRelationResponse = await fetch(
      `${API_BASE_URL}/classes/Book/${bookId}`,
      {
        method: "PUT",
        headers: { ...HEADERS, "X-Parse-Session-Token": sessionToken },
        body: JSON.stringify({
          genres: {
            __op: "AddRelation",
            objects: genreObjectIds.map((id) => ({
              __type: "Pointer",
              className: "Genre",
              objectId: id,
            })),
          },
        }),
      }
    );

    if (!genreRelationResponse.ok) {
      const error = await genreRelationResponse.json();
      console.warn(
        "Livro atualizado, mas falha ao atualizar gêneros:",
        error.error
      );
    }
  }

  return updatedBook;
}

// --- COMPONENTE PRINCIPAL ---
export const BookFormModal = ({ isOpen, onClose, bookToEdit }) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const sessionToken = user?.sessionToken;

  const fileInputRef = useRef(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    categoryObjectId: "",
    genreObjectIds: [],
    type: "Doação",
    coverFile: null,
    cover: null,
    city: "",
    stateObjectId: "",
  });

  // Pré-preenchimento ao abrir para edição
  useEffect(() => {
    if (bookToEdit && isOpen) {
      setFormData({
        title: bookToEdit.titulo || "",
        author: bookToEdit.author || "",
        description: bookToEdit.descricao || "",
        categoryObjectId: bookToEdit.categoryObjectId || "",
        genreObjectIds: bookToEdit.genreObjectIds || [],
        type: bookToEdit.tipo || "Doação",
        coverFile: null,
        cover: bookToEdit.cover || null,
        city: bookToEdit.city || bookToEdit.cidade || "",
        stateObjectId: bookToEdit.stateObjectId || "",
      });

      if (bookToEdit.capaUrl) {
        setCoverPreviewUrl(bookToEdit.capaUrl);
      }
    } else if (!bookToEdit && isOpen) {
      // Limpar form para novo cadastro
      setFormData({
        title: "",
        author: "",
        description: "",
        categoryObjectId: "",
        genreObjectIds: [],
        type: "Doação",
        coverFile: null,
        cover: null,
        city: "",
        stateObjectId: "",
      });
      setCoverPreviewUrl(null);
    }

    // Cleanup URL
    return () => {
      if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [bookToEdit, isOpen]);

  // Queries
  const statesQuery = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const genresQuery = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: 1000 * 60 * 5,
  });

  // Mutation de Edição
  const editMutation = useMutation({
    mutationFn: async (data) => {
      let coverObject = data.cover;

      // Se um novo arquivo foi selecionado, faz o upload
      if (data.coverFile) {
        coverObject = await uploadFileToBack4App(data.coverFile, sessionToken);
      }

      // Verifica se existe capa
      if (!coverObject) {
        throw new Error("A capa do livro é obrigatória.");
      }

      const bookToUpdate = {
        ...data,
        cover: coverObject,
      };

      return updateBookOnBack4App(bookToEdit.id, bookToUpdate, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minhasDoacoes"] });
      alert("Livro atualizado com sucesso!");
      onClose();
    },
    onError: (error) => {
      alert(`Erro na atualização: ${error.message}`);
      console.error(error);
    },
  });

  // Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    // Limpa preview anterior se for blob URL
    if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverPreviewUrl(null);

    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreviewUrl(url);
      setFormData({ ...formData, coverFile: file, cover: null });
    } else {
      setFormData({ ...formData, coverFile: null });
    }
  };

  const handleGenreChange = (objectId) => {
    setFormData((prev) => {
      const isSelected = prev.genreObjectIds.includes(objectId);
      return {
        ...prev,
        genreObjectIds: isSelected
          ? prev.genreObjectIds.filter((id) => id !== objectId)
          : [...prev.genreObjectIds, objectId],
      };
    });
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, coverFile: null, cover: null });
    
    if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    
    setCoverPreviewUrl(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações
    if (!formData.title?.trim() || !formData.author?.trim()) {
      alert("Por favor, preencha Título e Autor.");
      return;
    }

    if (!formData.categoryObjectId) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    if (!formData.genreObjectIds || formData.genreObjectIds.length === 0) {
      alert("Por favor, selecione pelo menos um gênero.");
      return;
    }

    if (!formData.city?.trim()) {
      alert("Por favor, preencha a cidade.");
      return;
    }

    if (!formData.stateObjectId) {
      alert("Por favor, selecione um estado.");
      return;
    }

    if (!formData.coverFile && !formData.cover) {
      alert("Por favor, envie a Capa do Livro.");
      return;
    }

    editMutation.mutate(formData);
  };

  const isLoadingOptions =
    statesQuery.isLoading || categoriesQuery.isLoading || genresQuery.isLoading;
  const isErrorOptions =
    statesQuery.isError || categoriesQuery.isError || genresQuery.isError;
  const isMutating = editMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl p-8 bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#AF7026]">
            Editar Livro: {bookToEdit?.titulo || "Novo Livro"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos para atualizar as informações do seu livro
            doado.
          </DialogDescription>
        </DialogHeader>

        {isLoadingOptions && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#AF7026]" />
            <p className="mt-2 text-muted-foreground">Carregando opções...</p>
          </div>
        )}

        {isErrorOptions && (
          <p className="text-center py-4 text-red-500">
            Erro ao carregar catálogo. Por favor, tente novamente.
          </p>
        )}

        {!isLoadingOptions && !isErrorOptions && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
          >
            {/* Upload da Capa */}
            <div className="flex flex-col items-center">
              <label
                htmlFor="cover-upload"
                className="w-full max-w-xs h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer transition hover:border-[#AF7026] relative overflow-hidden"
              >
                {coverPreviewUrl || formData.cover ? (
                  <>
                    <img
                      src={
                        coverPreviewUrl ||
                        formData.cover?.url ||
                        "/placeholder-book.png"
                      }
                      alt="Pré-visualização da capa"
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white/70 text-red-600 hover:bg-white hover:text-red-800 z-10"
                      aria-label="Remover capa"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-500" />
                    <span className="text-sm font-semibold mt-2 p-2 rounded-md shadow-md bg-[#AF7026] text-white">
                      Upload - Capa do livro
                    </span>
                  </>
                )}
                <input
                  type="file"
                  id="cover-upload"
                  ref={fileInputRef}
                  name="coverFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Campos do Formulário */}
            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Digite o título do livro"
                  required
                />
              </div>

              {/* Autor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor *
                </label>
                <Input
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Digite o nome do autor"
                  required
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#AF7026] focus:border-transparent"
                >
                  <option value="Doação">Doação</option>
                  <option value="Troca">Troca</option>
                  <option value="Venda">Venda</option>
                </select>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria Principal *
                </label>
                <select
                  name="categoryObjectId"
                  value={formData.categoryObjectId}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#AF7026] focus:border-transparent"
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriesQuery.data?.map((cat) => (
                    <option key={cat.objectId} value={cat.objectId}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ex: São Paulo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <select
                    name="stateObjectId"
                    value={formData.stateObjectId}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#AF7026] focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    {statesQuery.data?.map((state) => (
                      <option key={state.objectId} value={state.objectId}>
                        {state.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gêneros */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gêneros (Selecione um ou mais) *
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {genresQuery.data?.map((genre) => (
                    <Button
                      key={genre.objectId}
                      type="button"
                      onClick={() => handleGenreChange(genre.objectId)}
                      variant={
                        formData.genreObjectIds.includes(genre.objectId)
                          ? "default"
                          : "outline"
                      }
                      className={`text-sm ${
                        formData.genreObjectIds.includes(genre.objectId)
                          ? "bg-[#AF7026] hover:bg-[#8D5A1E]"
                          : "border-gray-400 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {genre.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (Opcional)
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descreva o livro, seu estado, etc..."
                />
              </div>

              {/* Botões */}
              <div className="col-span-1 md:col-span-2 flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isMutating}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isMutating}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  {isMutating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};