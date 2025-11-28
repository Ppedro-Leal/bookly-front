import Image from "next/image";
import { Button } from "./ui/button";
import { Gift, Home, Info, Library, Plus, User } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50 px-32 py-4 flex justify-between items-center shadow-md">
      <Link href="/">
        <Image
          src="/logo-navbar.png"
          alt="Logo"
          width={100}
          height={20}
          priority
        />
      </Link>
      <div className="flex gap-2">
        <Link href="/">
          <Button variant="ghost">
            <Home />
            Início
          </Button>
        </Link>
        <Button variant="ghost">
          <Library />
          Catálogo
        </Button>
        <Link href="/about">
          <Button variant="ghost">
            <Info />
            Sobre
          </Button>
        </Link>
        <Button variant="outline" size="lg">
          <User />
          Entrar
        </Button>
        <Link href="/forms">
          <Button size="lg">
            <Gift />
            Doar um Livro
          </Button>
        </Link>
      </div>
    </nav>
  );
}
