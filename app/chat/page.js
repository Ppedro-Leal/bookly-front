"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Send, Search, Phone, Video, Info } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [chats] = useState([
    {
      id: 1,
      name: "Ana Silva",
      lastMessage: "O livro chegou em perfeito estado!",
      time: "10:30",
      unread: 2,
      online: true,
      avatar: "/avatars/ana.jpg",
      messages: [
        {
          id: 1,
          text: "Olá! Gostei muito do livro que você está oferecendo!",
          sender: "other",
          time: "10:15",
          name: "Ana Silva",
        },
        {
          id: 2,
          text: "Oi Ana! Que bom que gostou! Ele está em ótimo estado.",
          sender: "me",
          time: "10:16",
        },
        {
          id: 3,
          text: "Perfeito! Podemos combinar a retirada?",
          sender: "other",
          time: "10:20",
          name: "Ana Silva",
        },
        {
          id: 4,
          text: "Claro! Estou disponível no centro durante a semana.",
          sender: "me",
          time: "10:22",
        },
        {
          id: 5,
          text: "O livro chegou em perfeito estado! Muito obrigada!",
          sender: "other",
          time: "10:30",
          name: "Ana Silva",
        },
      ],
    },
    {
      id: 2,
      name: "Carlos Santos",
      lastMessage: "Podemos combinar a entrega para sábado?",
      time: "09:15",
      unread: 0,
      online: true,
      avatar: "/avatars/carlos.jpg",
      messages: [
        {
          id: 1,
          text: "Bom dia! Vi que você tem o livro '1984' para empréstimo.",
          sender: "other",
          time: "09:00",
          name: "Carlos Santos",
        },
        {
          id: 2,
          text: "Bom dia Carlos! Sim, ainda está disponível.",
          sender: "me",
          time: "09:05",
        },
        {
          id: 3,
          text: "Podemos combinar a entrega para sábado?",
          sender: "other",
          time: "09:15",
          name: "Carlos Santos",
        },
      ],
    },
    {
      id: 3,
      name: "Marina Oliveira",
      lastMessage: "Obrigada pela troca!",
      time: "Ontem",
      unread: 0,
      online: false,
      avatar: "/avatars/marina.jpg",
      messages: [
        {
          id: 1,
          text: "Adorei o livro que você me emprestou!",
          sender: "other",
          time: "Ontem 14:20",
          name: "Marina Oliveira",
        },
        {
          id: 2,
          text: "Que bom que gostou! Espero que se divirta com a leitura.",
          sender: "me",
          time: "Ontem 14:25",
        },
        {
          id: 3,
          text: "Obrigada pela troca! Até a próxima.",
          sender: "other",
          time: "Ontem 14:30",
          name: "Marina Oliveira",
        },
      ],
    },
    {
      id: 4,
      name: "João Pereira",
      lastMessage: "Você tem outros livros do mesmo autor?",
      time: "Ontem",
      unread: 1,
      online: false,
      avatar: "/avatars/joao.jpg",
      messages: [
        {
          id: 1,
          text: "Olá! Acabei de ler o livro que peguei emprestado com você.",
          sender: "other",
          time: "Ontem 16:45",
          name: "João Pereira",
        },
        {
          id: 2,
          text: "Oi João! O que achou da leitura?",
          sender: "me",
          time: "Ontem 16:50",
        },
        {
          id: 3,
          text: "Foi incrível! Você tem outros livros do mesmo autor?",
          sender: "other",
          time: "Ontem 17:00",
          name: "João Pereira",
        },
      ],
    },
    {
      id: 5,
      name: "Beatriz Lima",
      lastMessage: "O livro está reservado para mim?",
      time: "11:45",
      unread: 3,
      online: true,
      avatar: "/avatars/beatriz.jpg",
      messages: [
        {
          id: 1,
          text: "Boa tarde! Vi o anúncio do livro 'O Cortiço'.",
          sender: "other",
          time: "11:30",
          name: "Beatriz Lima",
        },
        {
          id: 2,
          text: "Boa tarde Beatriz! Sim, ele está disponível.",
          sender: "me",
          time: "11:35",
        },
        {
          id: 3,
          text: "O livro está reservado para mim? Posso buscar amanhã!",
          sender: "other",
          time: "11:45",
          name: "Beatriz Lima",
        },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState(chats[0]);
  const [currentMessages, setCurrentMessages] = useState(chats[0].messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      id: currentMessages.length + 1,
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setCurrentMessages([...currentMessages, newMessage]);

    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          lastMessage: message,
          time: "Agora",
          unread: 0,
        };
      }
      return chat;
    });

    setMessage("");
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setCurrentMessages(chat.messages);

    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 };
      }
      return c;
    });
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden py-0">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="border-r bg-white">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar conversas..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-y-auto h-[520px]">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        activeChat.id === chat.id
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback>
                              {chat.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm truncate">
                              {chat.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {chat.time}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.lastMessage}
                            </p>
                            {chat.unread > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {chat.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col">
                <div className="p-4 border-b bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={activeChat.avatar} />
                      <AvatarFallback>
                        {activeChat.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{activeChat.name}</h3>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activeChat.online ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {activeChat.online ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="space-y-4">
                    {currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                            msg.sender === "me"
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-white border rounded-bl-none"
                          }`}
                        >
                          {msg.sender === "other" && (
                            <p className="text-xs font-semibold text-blue-600 mb-1">
                              {activeChat.name}
                            </p>
                          )}
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === "me"
                                ? "text-blue-200"
                                : "text-muted-foreground"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="p-4 border-t bg-white">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      placeholder={`Enviar mensagem para ${activeChat.name}...`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
