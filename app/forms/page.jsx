"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Upload, X, Check } from "lucide-react";
import useAuthStore from "@/store/userAuthStore";

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

async function registerBookOnBack4App(bookData, sessionToken) {
  if (!sessionToken) throw new Error("Usuário não autenticado.");

  const { title, genreObjectIds, categoryObjectId, type, cover } = bookData;

  const body = {
    title: title,
    type: type,
    cover: cover,
    category: {
      __type: "Pointer",
      className: "Category",
      objectId: categoryObjectId,
    },
    owner: {
      __type: "Pointer",
      className: "_User",
      objectId: useAuthStore.getState().user.objectId,
    },
  };

  const bookResponse = await fetch(`${API_BASE_URL}/classes/Book`, {
    method: "POST",
    headers: { ...HEADERS, "X-Parse-Session-Token": sessionToken },
    body: JSON.stringify(body),
  });

  if (!bookResponse.ok) {
    const error = await bookResponse.json();
    throw new Error(error.error || "Erro ao cadastrar livro (Parte 1).");
  }

  const newBook = await bookResponse.json();
  const newBookId = newBook.objectId;

  if (genreObjectIds && genreObjectIds.length > 0) {
    const genreRelationResponse = await fetch(
      `${API_BASE_URL}/classes/Book/${newBookId}`,
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
        "Livro registrado, mas falha ao adicionar gêneros:",
        error.error
      );
    }
  }

  return newBook;
}

export default function BookRegisterPage() {
  const [formData, setFormData] = useState({
    title: "",
    categoryObjectId: "",
    genreObjectIds: [],
    type: "Doação",
    coverFile: null,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const genresQuery = useQuery({ queryKey: ["genres"], queryFn: fetchGenres });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverFile: file });
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

  const registerMutation = useMutation({
    mutationFn: async (bookData) => {
      const currentUser = useAuthStore.getState().user;
      const currentSessionToken = currentUser?.sessionToken;

      if (!currentSessionToken)
        throw new Error("Você precisa estar logado para cadastrar um livro.");
      if (!bookData.categoryObjectId)
        throw new Error("Por favor, selecione a Categoria principal.");
      if (bookData.genreObjectIds.length === 0)
        throw new Error("Por favor, selecione pelo menos um Gênero.");

      const parseFileObject = await uploadFileToBack4App(
        bookData.coverFile,
        currentSessionToken
      );

      const bookToRegister = {
        title: bookData.title,
        type: bookData.type,
        categoryObjectId: bookData.categoryObjectId,
        genreObjectIds: bookData.genreObjectIds,
        cover: parseFileObject,
      };

      return registerBookOnBack4App(bookToRegister, currentSessionToken);
    },
    onSuccess: () => {
      alert("Livro cadastrado para Doação com sucesso!");
      setFormData({
        title: "",
        categoryObjectId: "",
        genreObjectIds: [],
        type: "Doação",
        coverFile: null,
      });
    },
    onError: (error) => {
      alert(`Erro no cadastro: ${error.message}`);
      console.error(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.coverFile) {
      alert("Por favor, preencha o Título e envie a Capa do Livro.");
      return;
    }

    registerMutation.mutate(formData);
  };

  if (categoriesQuery.isLoading || genresQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[#AF7026]">Carregando opções do catálogo...</p>
      </div>
    );
  }

  if (categoriesQuery.isError || genresQuery.isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>Erro ao carregar categorias e gêneros. Tente novamente.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2
            className={`text-3xl md:text-4xl font-bold text-center mb-12 text-[#AF7026]`}
          >
            Cadastro de livros
          </h2>

          <div className={`bg-[#BDA184] p-14 rounded-lg shadow-xl`}>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
            >
              <div className="flex flex-col items-center h-full">
                <label
                  htmlFor="cover-upload"
                  className="w-4/5 h-full bg-white rounded-lg border-2 border-gray-400 flex flex-col items-center justify-center cursor-pointer transition duration-300 hover:border-[#AF7026] relative"
                >
                  {formData.coverFile ? (
                    <div className="text-center p-4">
                      <Check className="h-6 w-6 text-green-500 mx-auto" />
                      <p className="text-sm font-semibold mt-2 text-white">
                        {formData.coverFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pronto para upload.
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFormData({ ...formData, coverFile: null });
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        aria-label="Remover capa"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-500" />
                      <span
                        className={`text-sm font-semibold mt-2 p-2 rounded-md shadow-md bg-[#AF7026] text-white`}
                      >
                        Upload - Capa do livro
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    id="cover-upload"
                    name="coverFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-lg font-semibold text-gray-800 mb-2"
                  >
                    Título:
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Digite aqui o título do seu livro..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border bg-white  border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AF7026] focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="categoryObjectId"
                    className="block text-lg font-semibold text-gray-800 mb-2"
                  >
                    Categoria principal:
                  </label>
                  <select
                    id="categoryObjectId"
                    name="categoryObjectId"
                    value={formData.categoryObjectId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[#AF7026] focus:border-transparent outline-none transition"
                  >
                    <option value="" disabled>
                      Selecione a Categoria principal
                    </option>
                    {categoriesQuery.data?.map((cat) => (
                      <option key={cat.objectId} value={cat.objectId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    Gêneros (Múltipla escolha):
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-gray-300 h-40 overflow-y-auto">
                    {genresQuery.data?.map((gen) => (
                      <label
                        key={gen.objectId}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition text-sm
                                                    ${
                                                      formData.genreObjectIds.includes(
                                                        gen.objectId
                                                      )
                                                        ? "bg-amber-100 border border-[#AF7026] text-[#AF7026] font-medium"
                                                        : "bg-gray-50 border border-gray-200 text-gray-700"
                                                    }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.genreObjectIds.includes(
                            gen.objectId
                          )}
                          onChange={() => handleGenreChange(gen.objectId)}
                          className="h-4 w-4 text-[#AF7026] border-gray-300 rounded focus:ring-[#AF7026]"
                        />
                        {gen.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    Tipo:
                  </label>
                  <div className="flex gap-4">
                    <div
                      className={`py-2 px-4 rounded-lg font-bold text-white shadow-md bg-[#AF7026]`}
                    >
                      Doar
                    </div>
                    <div className="py-2 px-4 rounded-lg font-bold text-gray-600 bg-gray-300 opacity-50 cursor-not-allowed">
                      Emprestar
                    </div>
                  </div>
                </div>

                <div className="pt-6 items-center flex justify-center">
                  <Button
                    type="submit"
                    className={`w-3/4 h-12 bg-[#AF7026] hover:bg-[#9A6020] text-white text-lg font-semibold py-3 cursor-pointer rounded-lg shadow-md disabled:opacity-50`}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending
                      ? "Cadastrando..."
                      : "Cadastrar Livro"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
