"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../store/userAuthStore";
import { User, Trash2, Lock, UserCog } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import Image from "next/image";

async function uploadFileToBack4App(file, sessionToken) {
  if (!file) throw new Error("Nenhum arquivo de avatar selecionado.");

  const uploadHeaders = {
    "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
    "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
    "Content-Type": file.type,
    "X-Parse-Session-Token": sessionToken,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACK4APP_API_URL}/files/${file.name}`,
    {
      method: "POST",
      headers: uploadHeaders,
      body: file,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao fazer upload do avatar.");
  }

  return response.json();
}

async function uploadAvatarAndSaveUser(file, userId, token) {
  const parseFileObject = await uploadFileToBack4App(file, token);

  const updateData = {
    avatar: {
      __type: "File",
      name: parseFileObject.name,
    },
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACK4APP_API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
        "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
        "X-Parse-Session-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao associar avatar ao usuário.");
  }
  return { ...(await response.json()), avatar: parseFileObject };
}

async function fetchUserData(sessionToken) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACK4APP_API_URL}/users/me`,
    {
      headers: {
        "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
        "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
        "X-Parse-Session-Token": sessionToken,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.error || "Falha ao buscar dados completos do usuário."
    );
  }

  return res.json();
}

async function updateUserData(data, userId, token) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACK4APP_API_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
        "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
        "X-Parse-Session-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar dados.");
  }
  return response.json();
}

async function deleteUser(userId, token) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACK4APP_API_URL}/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
        "X-Parse-REST-API-Key": process.env.NEXT_PUBLIC_BACK4APP_REST_KEY,
        "X-Parse-Session-Token": token,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao excluir conta.");
  }
  return {};
}

const initialDadosForm = {
  nome: "",
  username: "",
  email: "",
  telefone: "",
};

const initialPerfilForm = {
  sobreMim: "",
  generosFavoritos: "",
  autoresFavoritos: "",
};

export default function ProfileSettings() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState("dados");

  const [isEditingDados, setIsEditingDados] = useState(false);
  const [isEditingPerfil, setIsEditingPerfil] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [dadosForm, setDadosForm] = useState(initialDadosForm);
  const [perfilForm, setPerfilForm] = useState(initialPerfilForm);

  const fileInputRef = useRef(null);

  const resetDadosForm = useCallback(() => {
    setDadosForm({
      nome: user.nome || "",
      username: user.username || "",
      email: user.email || "",
      telefone: user.telefone || "",
    });
  }, [user]);

  const resetPerfilForm = useCallback(() => {
    setPerfilForm({
      sobreMim: user.sobreMim || "",
      generosFavoritos: user.generosFavoritos || "",
      autoresFavoritos: user.autoresFavoritos || "",
    });
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      if (user && user.sessionToken) {
        try {
          const fullUserData = await fetchUserData(user.sessionToken);
          updateUser(fullUserData);

          if (!isEditingDados) {
            setDadosForm({
              nome: fullUserData.nome || "",
              username: fullUserData.username || "",
              email: fullUserData.email || "",
              telefone: fullUserData.telefone || "",
            });
          }

          if (!isEditingPerfil) {
            setPerfilForm({
              sobreMim: fullUserData.sobreMim || "",
              generosFavoritos: fullUserData.generosFavoritos || "",
              autoresFavoritos: fullUserData.autoresFavoritos || "",
            });
          }
        } catch (error) {
          console.error("Erro ao carregar dados completos:", error.message);
          if (error.message.includes("Invalid session")) {
            logout();
            router.push("/prelogin");
          }
        } finally {
          setIsLoading(false);
        }
      } else if (user === false) {
        router.push("/prelogin");
        setIsLoading(false);
      }
    };

    if (user !== undefined) {
      loadData();
    }
  }, [user, router, updateUser, logout, isEditingDados, isEditingPerfil]);

  const updateMutation = useMutation({
    mutationFn: (data) =>
      updateUserData(data, user.objectId, user.sessionToken),
    onSuccess: (data) => {
      updateUser(data);
      setIsEditingDados(false);
      setIsEditingPerfil(false);
      alert("Dados atualizados com sucesso!");
    },
    onError: (error) => {
      alert("Erro ao atualizar: " + error.message);
    },
  });

  const avatarUpdateMutation = useMutation({
    mutationFn: (file) =>
      uploadAvatarAndSaveUser(file, user.objectId, user.sessionToken),
    onSuccess: (data) => {
      updateUser(data);
      alert("Foto de perfil atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar foto:", error);
      alert("Erro ao atualizar foto: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(user.objectId, user.sessionToken),
    onSuccess: () => {
      logout();
      alert("Conta excluída com sucesso.");
      router.push("/");
    },
    onError: (error) => {
      alert("Erro ao excluir conta: " + error.message);
    },
  });

  const getInputClass = (isEditing) =>
    `w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors duration-200 ${
      isEditing
        ? "focus:ring-2 focus:ring-amber-500 outline-none"
        : "bg-gray-100 text-gray-700 cursor-default opacity-80"
    }`;

  const handleDadosChange = (e) => {
    const { name, value } = e.target;
    setDadosForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfilForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      avatarUpdateMutation.mutate(file);

      e.target.value = null;
    }
  };

  const handleDadosSubmit = (e) => {
    e.preventDefault();
    if (!isEditingDados) {
      setIsEditingDados(true);
    } else {
      updateMutation.mutate(dadosForm);
    }
  };

  const handlePerfilSubmit = (e) => {
    e.preventDefault();
    if (!isEditingPerfil) {
      setIsEditingPerfil(true);
    } else {
      updateMutation.mutate(perfilForm);
    }
  };

  const handleCancelEditDados = () => {
    resetDadosForm();
    setIsEditingDados(false);
  };

  const handleCancelEditPerfil = () => {
    resetPerfilForm();
    setIsEditingPerfil(false);
  };

  const getButtonText = (isPending, isEditing) => {
    if (isPending) return "Salvando...";
    return isEditing ? "Salvar edição" : "Editar";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500">Carregando perfil...</p>
      </div>
    );
  }

  if (!user) return null;

  const renderTabHeader = (tabName, Icon, label) => {
    const isActive = activeTab === tabName;
    return (
      <div
        key={tabName}
        onClick={() => setActiveTab(tabName)}
        className={`flex items-center gap-2 cursor-pointer pb-2 transition-colors ${
          isActive
            ? "text-[#AF7026] border-b-2 border-[#AF7026] font-semibold"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="text-lg">{label}</span>
      </div>
    );
  };

  const renderDadosCadastrais = () => {
    const inputProps = {
      readOnly: !isEditingDados,
      className: getInputClass(isEditingDados),
    };

    return (
      <div className="pt-8">
        <h3 className="text-2xl font-bold text-gray-900">Dados cadastrais</h3>
        <p className="text-gray-500 mb-8">Edite seus dados de cadastro</p>

        <form onSubmit={handleDadosSubmit} className="space-y-6">
          <h4 className="text-xl font-semibold border-b pb-2 mb-4">
            Informações gerais
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome e Sobrenome"
              value={dadosForm.nome}
              onChange={handleDadosChange}
              required
              {...inputProps}
            />
            <input
              type="text"
              name="telefone"
              placeholder="(xx) xxxxx-xxxx"
              value={dadosForm.telefone}
              onChange={handleDadosChange}
              {...inputProps}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500 text-lg">
                @
              </span>
              <input
                type="text"
                name="username"
                placeholder="Usuário"
                value={dadosForm.username}
                onChange={handleDadosChange}
                required
                className={`pl-8 pr-4 py-3 border border-gray-300 rounded-lg w-full ${inputProps.className}`}
                readOnly={inputProps.readOnly}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={dadosForm.email}
              onChange={handleDadosChange}
              required
              {...inputProps}
            />

            <div className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                <span
                  className="font-semibold cursor-pointer text-[#AF7026] hover:underline"
                  onClick={() =>
                    alert("Implementar modal/rota de mudança de senha")
                  }
                >
                  Alterar Senha
                </span>
              </span>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-[#7D4D0B] text-white font-semibold py-3 px-8 rounded-lg transition duration-200 hover:bg-[#6A4009] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getButtonText(updateMutation.isPending, isEditingDados)}
            </button>
            {isEditingDados && (
              <button
                type="button"
                onClick={handleCancelEditDados}
                className="border border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  const renderPerfil = () => {
    const baseInputClass = getInputClass(isEditingPerfil);

    return (
      <div className="pt-8 flex gap-8">
        <div className="w-1/4 space-y-4">
          <div className="text-center">
            <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 mb-2 overflow-hidden flex items-center justify-center relative border-4 border-gray-300">
              {user.avatar?.url ? (
                <Image
                  src={user.avatar.url}
                  alt="Avatar"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-gray-500" />
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
              disabled={avatarUpdateMutation.isPending}
            />

            <button
              className={`text-[#AF7026] text-sm hover:underline mt-2 ${
                avatarUpdateMutation.isPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUpdateMutation.isPending}
            >
              {avatarUpdateMutation.isPending
                ? "Enviando..."
                : "Escolher arquivo"}
            </button>
          </div>
        </div>

        <div className="w-3/4">
          <h3 className="text-2xl font-bold text-gray-900">Perfil</h3>
          <p className="text-gray-500 mb-8">
            Enriqueça sua página com mais informações sobre você
          </p>

          <form onSubmit={handlePerfilSubmit} className="space-y-6">
            <h4 className="text-xl font-semibold border-b pb-2 mb-4">
              Sobre mim:
            </h4>
            <textarea
              name="sobreMim"
              placeholder="Conte um pouco sobre suas paixões por livros..."
              value={perfilForm.sobreMim}
              onChange={handlePerfilChange}
              rows={4}
              readOnly={!isEditingPerfil}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg resize-none ${baseInputClass}`}
            />

            <h4 className="text-xl font-semibold border-b pb-2 mb-4 pt-4">
              Gêneros favoritos:
            </h4>
            <input
              type="text"
              name="generosFavoritos"
              placeholder="Ex: Romance, Ficção Científica, Mitologia (separados por vírgula)"
              value={perfilForm.generosFavoritos}
              onChange={handlePerfilChange}
              readOnly={!isEditingPerfil}
              className={baseInputClass}
            />

            <h4 className="text-xl font-semibold border-b pb-2 mb-4 pt-4">
              Autores favoritos:
            </h4>
            <input
              type="text"
              name="autoresFavoritos"
              placeholder="Ex: Machado de Assis, Jane Austen (separados por vírgula)"
              value={perfilForm.autoresFavoritos}
              onChange={handlePerfilChange}
              readOnly={!isEditingPerfil}
              className={baseInputClass}
            />

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-[#7D4D0B] text-white font-semibold py-3 px-8 rounded-lg transition duration-200 hover:bg-[#6A4009] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getButtonText(updateMutation.isPending, isEditingPerfil)}
              </button>
              {isEditingPerfil && (
                <button
                  type="button"
                  onClick={handleCancelEditPerfil}
                  className="border border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderExcluirConta = () => (
    <div className="pt-8 text-center max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900">Excluir conta</h3>
      <div className="mt-20 p-8 rounded-lg">
        <p className="text-lg text-gray-700 mb-6">
          Ei... já vai voar pra longe?
        </p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          A gente adoraria que você ficasse aqui na colmeia. Prometemos
          continuar construindo um cantinho doce, leve e cheio de boas histórias
          pra você. Pensa com carinho antes de bater as asas, tá? :)
        </p>

        <button
          onClick={() => {
            if (
              confirm(
                "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
              )
            ) {
              deleteMutation.mutate();
            }
          }}
          disabled={deleteMutation.isPending}
          className="bg-gray-500 hover:bg-red-600 text-white font-semibold py-3 px-12 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
        >
          {deleteMutation.isPending ? "Excluindo..." : "Excluir conta"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-20 px-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-10 border-b border-gray-300 mb-10">
            {renderTabHeader("dados", User, "Dados cadastrais")}
            {renderTabHeader("perfil", UserCog, "Perfil")}
            {renderTabHeader("excluir", Trash2, "Excluir conta")}
          </div>

          {activeTab === "dados" && renderDadosCadastrais()}
          {activeTab === "perfil" && renderPerfil()}
          {activeTab === "excluir" && renderExcluirConta()}
        </div>
      </div>
    </>
  );
}
