"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Home,
  Library,
  User,
  LogOut,
  ChevronDown,
  UserCog,
  LogIn,
  Gift,
  Book,
  Handshake,
  Menu,
  X,
  Info,
  BookOpen,
  ClipboardListIcon,
  BookPlus,
} from "lucide-react";
import useAuthStore from "../store/userAuthStore";
import { useState } from "react";

const MobileMenu = ({
  isAuthenticated,
  navigate,
  handleLogout,
  finalDisplayName,
  perfilRoute,
  setIsMobileMenuOpen,
}) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 lg:hidden shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <Image
          src="/logo-navbar.png"
          alt="Logo"
          width={100}
          height={20}
          priority
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <Button
          variant="ghost"
          size="default"
          onClick={() => navigate("/")}
          className="justify-start"
        >
          <Home className="h-5 w-5 mr-3" /> Início
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={() => navigate("/livros")}
          className="justify-start"
        >
          <Book className="h-5 w-5 mr-3" /> Livros
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={() => navigate("/doacoes")}
          className="justify-start"
        >
          <Handshake className="h-5 w-5 mr-3" /> Doações
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={() => navigate("/sobre")}
          className="justify-start"
        >
          <Info className="h-5 w-5 mr-3" /> Sobre
        </Button>

        <hr className="my-2" />

        {isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              size="default"
              onClick={() => navigate("/perfil")}
              className="justify-start"
            >
              <UserCog className="h-5 w-5 mr-3" /> Perfil ({finalDisplayName})
            </Button>
            <Button
              size="default"
              onClick={() => navigate("/forms")}
              className="bg-[#AF7026] hover:bg-[#7D4D0B] text-white justify-start"
            >
              <Gift className="h-5 w-5 mr-3" /> Doar um livro
            </Button>
            <Button
              variant="destructive"
              size="default"
              onClick={handleLogout}
              className="justify-start"
            >
              <LogOut className="h-5 w-5 mr-3" /> Sair
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="default"
              onClick={() => navigate(perfilRoute)}
              className="justify-start"
            >
              <User className="h-5 w-5 mr-3" /> Perfil
            </Button>
            <Button
              size="default"
              onClick={() => navigate("/prelogin")}
              className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
            >
              <LogIn className="h-5 w-5 mr-3" /> Entrar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = (path) => {
    router.push(path);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const NavButton = ({ href, icon: Icon, size, variant, children }) => (
    <Button
      className="cursor-pointer"
      size={size ? size : "default"}
      variant={variant}
      onClick={() => navigate(href)}
    >
      <Icon className="h-5 w-5 mr-1" />
      {children}
    </Button>
  );

  const handleLogout = () => {
    logout();
    router.push("/prelogin");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const displayName = user?.nome || user?.username;
  const finalAvatarSrc = user?.avatar?.url;
  const perfilRoute = isAuthenticated ? "/perfil" : "/prelogin";
  const finalDisplayName = displayName || "Usuário";
  const shouldWaitForName = isAuthenticated && !displayName;

  if (isMobileMenuOpen) {
    return (
      <MobileMenu
        isAuthenticated={isAuthenticated}
        navigate={navigate}
        handleLogout={handleLogout}
        finalDisplayName={finalDisplayName}
        perfilRoute={perfilRoute}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    );
  }

  if (shouldWaitForName) {
    return (
      <nav className="bg-white sticky top-0 z-50 px-4 py-4 flex justify-between items-center shadow-md grow lg:px-32">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <Image
            src="/logo-navbar.png"
            alt="Logo"
            width={100}
            height={20}
            priority
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="lg:flex gap-2 items-center ml-4 hidden">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-36 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex items-center gap-1 p-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </Button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white sticky top-0 z-50 px-4 py-4 flex justify-between items-center shadow-md lg:px-32">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <Image
          src="/logo-navbar.png"
          alt="Logo"
          width={100}
          height={20}
          priority
        />
      </div>

      <div className="flex gap-2 items-center">
        {isAuthenticated ? (
          <div className="lg:flex gap-2 items-center ml-4 hidden">
            <NavButton href="/livros" variant={"ghost"} icon={BookOpen}>
              Livros
            </NavButton>
            <NavButton href="/doacoes" variant={"ghost"} icon={Handshake}>
              Doações
            </NavButton>
            <NavButton href="/pedidos" variant={"ghost"} icon={ClipboardListIcon}>
              Pedidos
            </NavButton>
            <NavButton
              href="/forms"
              size={"xl"}
              variant={"outline"}
              icon={Gift}
            >
              Doar um livro
            </NavButton>

            <div className="relative">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 transition duration-150 cursor-pointer border border-transparent hover:border-gray-200"
              >
                <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden">
                  {finalAvatarSrc ? (
                    <Image
                      key={finalAvatarSrc}
                      src={finalAvatarSrc}
                      alt="Foto de Perfil"
                      width={32}
                      height={32}
                      className="object-cover h-full w-full"
                      priority
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <span className="text-gray-900 font-semibold text-sm whitespace-nowrap">
                  Olá, {finalDisplayName}!
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div
                    onClick={() => navigate("/perfil")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <UserCog className="h-4 w-4" /> Perfil
                  </div>
                  <div
                    onClick={() => navigate("/solicitacoes")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <BookPlus className="h-4 w-4" /> Solicitações
                  </div>
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer border-t border-gray-100 mt-1"
                  >
                    <LogOut className="h-4 w-4" /> Sair
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:flex gap-2 items-center ml-4 hidden">
            <NavButton href="/" variant={"ghost"} icon={Home}>
              Início
            </NavButton>
            <NavButton href="/livros" variant={"ghost"} icon={Library}>
              Livros
            </NavButton>
            <NavButton href={perfilRoute} variant={"ghost"} icon={User}>
              Perfil
            </NavButton>
            <NavButton
              href="/prelogin"
              size={"xl"}
              variant={"outline"}
              icon={LogIn}
            >
              Entrar
            </NavButton>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-7 w-7" />
        </Button>
      </div>
    </nav>
  );
}
