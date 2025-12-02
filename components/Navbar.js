"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Home,
  Info,
  Library,
  User,
  LogOut,
  ChevronDown,
  UserCog,
  LogIn,
  Gift,
  Book,
  Handshake,
} from "lucide-react";
import useAuthStore from "../store/userAuthStore";
import { useState } from "react";
import { NavButton } from "./navButton";

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = (path) => {
    router.push(path);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/prelogin");
    setIsDropdownOpen(false);
  };

  const displayName = user?.nome || user?.username;

  const perfilRoute = isAuthenticated ? "/perfil" : "/prelogin";

  const shouldWaitForName = isAuthenticated && !displayName;

  if (shouldWaitForName) {
    return (
      <nav className="bg-white sticky top-0 z-50 px-32 py-4 flex justify-between items-center shadow-md">
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
          <div className="flex gap-2 items-center ml-4">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-36 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex items-center gap-1 p-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const finalDisplayName = displayName || "Usuário";

  return (
    <nav className="bg-white sticky top-0 z-50 px-32 py-4 flex justify-between items-center shadow-md">
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
          <div className="flex gap-2 items-center ml-4">
            <NavButton href="/livros" variant={"ghost"} icon={Book}>
              Livros
            </NavButton>
            <NavButton href="/doacoes" variant={"ghost"} icon={Handshake}>
              Doações
            </NavButton>
            <NavButton href="/sobre" variant={"ghost"} icon={Handshake}>
              Sobre
            </NavButton>
            <NavButton
              href="/prelogin"
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
                <div className="h-8 w-8 rounded-full bg-[#AF7026] flex items-center justify-center overflow-hidden">
                  <User className="h-5 w-5 text-white" />
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
                    <UserCog className="h-4 w-4" />
                    Perfil
                  </div>

                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer border-t border-gray-100 mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center ml-4">
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
      </div>
    </nav>
  );
}
