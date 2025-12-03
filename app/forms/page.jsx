"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Upload, X, Check } from "lucide-react";

export default function BookRegisterPage() {
  const [formData, setFormData] = useState({
    title: "",
    categoryObjectId: "",
    genreObjectIds: [],
    type: "Doação",
    coverFile: null,
  });

  const fileInputRef = useRef(null);

  const mockCategories = [
    { objectId: "1", name: "Ficção" },
    { objectId: "2", name: "Não-Ficção" },
    { objectId: "3", name: "Romance" },
  ];

  const mockGenres = [
    { objectId: "1", name: "Aventura" },
    { objectId: "2", name: "Drama" },
    { objectId: "3", name: "Suspense" },
    { objectId: "4", name: "Comédia" },
    { objectId: "5", name: "Terror" },
    { objectId: "6", name: "Fantasia" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Por favor, selecione apenas imagens PNG, JPG ou JPEG");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }

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

  const handleRemoveFile = () => {
    setFormData({ ...formData, coverFile: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.coverFile) {
      alert("Por favor, preencha o Título e envie a Capa do Livro.");
      return;
    }

    if (!formData.categoryObjectId) {
      alert("Por favor, selecione a Categoria principal.");
      return;
    }

    if (formData.genreObjectIds.length === 0) {
      alert("Por favor, selecione pelo menos um Gênero.");
      return;
    }

    console.log("Formulário enviado:", formData);
    alert("Design atualizado! API será integrada no próximo commit.");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#AF7026]">
            Cadastro de livros
          </h2>

          <div className="bg-[#BDA184] p-14 rounded-lg shadow-xl">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
            >
              <div className="flex flex-col items-center h-full">
                <label
                  htmlFor="cover-upload"
                  className="w-4/5 h-full bg-white rounded-lg border-2 border-gray-400 flex flex-col items-center justify-center cursor-pointer transition duration-300 hover:border-[#AF7026] relative min-h-[400px]"
                >
                  {formData.coverFile ? (
                    <div className="text-center p-4">
                      <Check className="h-6 w-6 text-green-500 mx-auto" />
                      <p className="text-sm font-semibold mt-2 text-gray-700">
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
                          handleRemoveFile();
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
                    className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AF7026] focus:border-transparent outline-none transition"
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
                    {mockCategories.map((cat) => (
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
                    {mockGenres.map((gen) => (
                      <label
                        key={gen.objectId}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition text-sm ${
                          formData.genreObjectIds.includes(gen.objectId)
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
                    <div className="py-2 px-4 rounded-lg font-bold text-white shadow-md bg-[#AF7026]">
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
                    className="w-3/4 h-12 bg-[#AF7026] hover:bg-[#9A6020] text-white text-lg font-semibold py-3 cursor-pointer rounded-lg shadow-md"
                  >
                    Cadastrar Livro
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
