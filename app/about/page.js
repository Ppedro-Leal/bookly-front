"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, BookOpen, Target, Globe } from "lucide-react";

export default function Sobre() {
  const valores = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Solidariedade",
      description:
        "Acreditamos no poder da generosidade e no compartilhamento como forma de transformar vidas através da leitura.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidade",
      description:
        "Unimos leitores em uma rede colaborativa onde todos podem contribuir e se beneficiar do conhecimento compartilhado.",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Acesso à Leitura",
      description:
        "Trabalhamos para democratizar o acesso aos livros e formar uma sociedade mais leitora e crítica.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Sustentabilidade",
      description:
        "Promovemos o reaproveitamento de livros, reduzindo o desperdício e incentivando o consumo consciente.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Sobre o <span className="text-yellow-600">Bookly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Somos uma plataforma dedicada a conectar pessoas através da doação
              de livros. Nosso objetivo é transformar livros esquecidos em novas
              oportunidades de leitura e conhecimento para toda a comunidade.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-2 border-yellow-100">
              <CardContent className="p-6">
                <Target className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Nossa Missão</h3>
                <p className="text-gray-600">
                  Facilitar o acesso à leitura através de doações de livros,
                  conectando doadores e receptores em uma rede solidária que
                  promove educação e cultura.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-yellow-100">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Nossa Visão</h3>
                <p className="text-gray-600">
                  Ser a maior plataforma de doação de livros do Brasil, formando
                  uma comunidade leitora ativa e contribuindo para um país mais
                  educado e culturalmente rico.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-yellow-100">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Nossos Valores</h3>
                <p className="text-gray-600">
                  Solidariedade, transparência, comunidade, sustentabilidade e
                  amor pela leitura guiam cada ação da nossa plataforma.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nos move
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça os princípios que orientam nosso trabalho e nos inspiram a
              criar uma comunidade cada vez mais forte
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {valores.map((valor, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="text-yellow-600 mb-4 flex justify-center">
                    {valor.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{valor.title}</h3>
                  <p className="text-gray-600 text-sm">{valor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
              <p className="text-yellow-800 font-medium italic">
                Um livro doado é uma história compartilhada, um conhecimento
                multiplicado e um futuro enriquecido.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
