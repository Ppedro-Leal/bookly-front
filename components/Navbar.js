import Image from "next/image";
import { Button } from "./ui/button";
import { Home, Info, Library, Plus, User } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50 px-32 py-4 flex justify-between items-center shadow-md">
      <Image
        src="/logo-navbar.png"
        alt="Logo"
        width={100}
        height={20}
        priority
      />
      <div className="flex gap-2">
        <Button variant="ghost">
          <Home />
          Início
        </Button>
        <Button variant="ghost">
          <Library />
          Catálogo
        </Button>
        <Button variant="ghost">
          <Info />
          Sobre
        </Button>
        <Button variant="outline" size="lg">
          <User />
          Entrar
        </Button>
        <Button size="lg">
          <Plus />
          Cadastrar Livro
        </Button>
      </div>
    </nav>
  );
}
