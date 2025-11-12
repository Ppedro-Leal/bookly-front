import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-yellow-700 px-32 py-8 flex justify-between items-center shadow-md">
      <div className="flex flex-col gap-16">
        <Image
          src="/logo-footer.png"
          alt="Logo"
          width={150}
          height={20}
          priority
        />
        <span className="text-white font-light">
          © 2025 Bookly. Todos os direitos reservados.
        </span>
      </div>
      <div className="flex flex-col gap-4 text-white">
        <span className="text-xl font-bold">Explore</span>
        <span>Início</span>
        <span>Livros Disponíveis</span>
        <span>Como Funciona</span>
      </div>
      <div className="flex flex-col gap-4 text-white">
        <span className="text-xl font-bold">Saiba mais</span>
        <span>Sobre o Bookly</span>
        <span>Quem somos</span>
        <span>Fale conosco</span>
      </div>
      <div className="flex flex-col gap-4 text-white">
        <span className="text-xl font-bold">Redes Sociais</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Youtube className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
