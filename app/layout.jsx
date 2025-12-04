import "./globals.css";
import { Providers } from "../providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bookly | Sua Rede de Livros",
  description: "Plataforma de compartilhamento e empréstimo de livros.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className={inter.className}>
      <body className="flex flex-col min-h-screen bg-[#FFFFFB]">
        <Providers>
          <main className="grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
