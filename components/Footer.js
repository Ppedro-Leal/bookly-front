import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#AF7026] px-4 py-8 shadow-md md:px-32">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
                

                <div className="flex flex-col gap-4 md:gap-16 items-start">
                    <Image
                        src="/logo-footer.png"
                        alt="Logo"
                        width={150}
                        height={20}
                        priority
                    />
                    <span className="text-white font-light text-sm mt-4 md:mt-0">
                        © 2025 Bookly. Todos os direitos reservados.
                    </span>
                </div>
                

                <div className="grid grid-cols-2 gap-8 md:flex md:gap-16 text-white text-sm">
                    

                    <div className="flex flex-col gap-3">
                        <span className="text-base font-bold mb-1">Explore</span>
                        <a href="/" className="hover:underline">Início</a>
                        <a href="/livros" className="hover:underline">Livros Disponíveis</a>
                        <a href="#comofunciona" className="hover:underline">Como Funciona</a>
                    </div>
                    

                    <div className="flex flex-col gap-3">
                        <span className="text-base font-bold mb-1">Saiba mais</span>
                        <a href="/sobre" className="hover:underline">Sobre o Bookly</a>
                        <a href="#quem-somos" className="hover:underline">Quem somos</a>
                        <a href="#fale-conosco" className="hover:underline">Fale conosco</a>
                    </div>
                    
                </div>


                <div className="flex flex-col gap-4 text-white">
                    <span className="text-base font-bold">Redes Sociais</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:opacity-80 transition-opacity">
                            <Facebook className="h-6 w-6" />
                        </a>
                        <a href="#" className="hover:opacity-80 transition-opacity">
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="#" className="hover:opacity-80 transition-opacity">
                            <Instagram className="h-6 w-6" />
                        </a>
                        <a href="#" className="hover:opacity-80 transition-opacity">
                            <Youtube className="h-6 w-6" />
                        </a>
                        <a href="#" className="hover:opacity-80 transition-opacity">
                            <Linkedin className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}