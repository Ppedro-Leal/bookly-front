"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  Upload,
  BookOpen,
  User,
  MapPin,
  CheckCircle,
} from "lucide-react";

export default function CadastrarLivro() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    genero: "",
    condicao: "",
    descricao: "",
    localizacao: "",
  });

  const generos = [
    "Ficção",
    "Não-Ficção",
    "Romance",
    "Fantasia",
    "Ficção Científica",
    "Mistério",
    "Suspense",
    "Biografia",
    "História",
    "Autoajuda",
    "Infantil",
    "Young Adult",
    "Poesia",
    "Drama",
    "Aventura",
  ];

  const condicoes = [
    "Novo",
    "Como novo",
    "Usado - Bom estado",
    "Usado - Desgaste moderado",
    "Usado - Desgaste acentuado",
  ];

  useEffect(() => {
    const checkAuth = () => {
      const userToken = localStorage.getItem("userToken");
      const userData = localStorage.getItem("userData");

      if (!userToken || !userData) {
        router.push("/prelogin?redirect=/forms");
        return;
      }

      setIsLoggedIn(true);
    };

    checkAuth();
  }, [router]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
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

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const inputEvent = {
        target: {
          files: files,
        },
      };
      handleImageUpload(inputEvent);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push("/login?redirect=/forms");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      if (selectedImage) {
        submitData.append("imagem", selectedImage);
      }

      // Recuperar dados do usuário logado
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      submitData.append("doador_id", userData.id);
      submitData.append("doador_nome", userData.name);

      console.log("Dados do livro:", {
        ...formData,
        doador: userData.name,
        imagem: selectedImage ? selectedImage.name : "Nenhuma imagem",
      });

      // Simular envio para API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Sucesso - redirecionar para home com mensagem de sucesso
      router.push("/?success=doacao_cadastrada");
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error);
      alert("Erro ao cadastrar livro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Verificando autenticação...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Informações do Livro para Doação
              </CardTitle>
              <CardDescription>
                Preencha as informações sobre o livro que deseja doar
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="titulo" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Título do Livro *
                    </Label>
                    <Input
                      id="titulo"
                      placeholder="Digite o título do livro"
                      value={formData.titulo}
                      onChange={(e) => handleChange("titulo", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="autor" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Autor *
                    </Label>
                    <Input
                      id="autor"
                      placeholder="Nome do autor"
                      value={formData.autor}
                      onChange={(e) => handleChange("autor", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="genero">Gênero *</Label>
                    <Select
                      value={formData.genero}
                      onValueChange={(value) => handleChange("genero", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        {generos.map((genero) => (
                          <SelectItem key={genero} value={genero}>
                            {genero}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condicao">Condição do Livro *</Label>
                    <Select
                      value={formData.condicao}
                      onValueChange={(value) => handleChange("condicao", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a condição" />
                      </SelectTrigger>
                      <SelectContent>
                        {condicoes.map((condicao) => (
                          <SelectItem key={condicao} value={condicao}>
                            {condicao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="localizacao"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Localização para Retirada *
                  </Label>
                  <Input
                    id="localizacao"
                    placeholder="Ex: Centro, São Paulo - SP"
                    value={formData.localizacao}
                    onChange={(e) =>
                      handleChange("localizacao", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição do Livro</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva o livro, inclua informações relevantes sobre o estado, edição, ou qualquer detalhe importante..."
                    rows={4}
                    value={formData.descricao}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Foto do Livro</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                  />

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      selectedImage
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {selectedImage ? (
                      <div className="space-y-4">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <div>
                          <p className="text-sm text-green-600 font-medium mb-1">
                            Imagem selecionada com sucesso!
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            {selectedImage.name}
                          </p>
                        </div>
                        {imagePreview && (
                          <div className="max-w-xs mx-auto">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-32 mx-auto rounded shadow-sm"
                            />
                          </div>
                        )}
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            Alterar Imagem
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Clique na área ou arraste outra imagem para alterar
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                          Arraste e solte uma imagem ou clique para selecionar
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          Selecionar Imagem
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG, JPEG até 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="termos"
                      className="mt-1"
                      required
                    />
                    <Label htmlFor="termos" className="text-sm">
                      Concordo com os termos de uso e confirmo que sou o
                      proprietário legítimo deste livro e desejo doá-lo
                      gratuitamente.
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="privacidade"
                      className="mt-1"
                      required
                    />
                    <Label htmlFor="privacidade" className="text-sm">
                      Concordo com a política de privacidade e tratamento dos
                      meus dados.
                    </Label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Cadastrando Doação...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Cadastrar Doação
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
