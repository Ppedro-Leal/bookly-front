# Bookly

Plataforma colaborativa para **doação e empréstimo de livros entre usuários**, desenvolvida como projeto acadêmico no curso de Sistemas para Internet da Universidade Católica de Pernambuco (UNICAP).

O Bookly busca facilitar o acesso à leitura por meio do compartilhamento de livros, permitindo que usuários encontrem títulos disponíveis, cadastrem livros e acompanhem solicitações dentro da plataforma.

## Demonstração

A aplicação está disponível em:

https://bookly-front.vercel.app/

É possível criar uma conta diretamente pela plataforma para testar as funcionalidades disponíveis.

## Principais funcionalidades

- Cadastro e autenticação de usuários
- Catálogo de livros disponíveis
- Pesquisa por título, autor ou categoria
- Filtros por categorias e gêneros
- Visualização detalhada de livros
- Cadastro de livros
- Solicitação de livros
- Gerenciamento de solicitações
- Gerenciamento de doações
- Gerenciamento de pedidos
- Perfil de usuário
- Upload de foto de perfil
- Interface responsiva para desktop e dispositivos móveis

## Tecnologias

### Front-end

- React 19
- Next.js 16
- JavaScript
- Tailwind CSS 4
- Radix UI

### Estado e comunicação

- Zustand
- TanStack React Query
- Axios

### Ferramentas

- ESLint
- Git
- GitHub
- Vercel

## Minha contribuição

O projeto foi desenvolvido em equipe. Entre as funcionalidades e melhorias registradas no histórico de desenvolvimento em que atuei diretamente estão:

- Desenvolvimento da tela de livros
- Desenvolvimento das telas de solicitações, pedidos e doações
- Desenvolvimento e ajustes da tela de perfil do usuário
- Implementação de recursos relacionados à foto de perfil
- Desenvolvimento do menu e de ajustes de navegação para dispositivos móveis
- Implementação e ajustes de filtros para dispositivos móveis
- Integrações e correções relacionadas ao consumo de dados do Back4App
- Adição de informações de cidade e estado relacionadas às doações
- Ajustes de interface e responsividade em diferentes telas da aplicação

## Engenharia de Software

Além do desenvolvimento da aplicação, o projeto envolveu atividades de análise e modelagem de software, incluindo:

- Levantamento e especificação de requisitos
- Histórias de usuário
- Requisitos funcionais e não funcionais
- Diagrama de casos de uso
- Diagrama de classes
- Modelagem de processos com BPMN
- Modelo Entidade-Relacionamento (MER)
- Modelagem da estrutura de dados

## Estrutura do projeto

O front-end utiliza a estrutura do Next.js, com separação entre páginas, componentes, dados, recursos compartilhados e gerenciamento de estado.

```text
bookly-front/
├── app/
├── components/
├── data/
├── lib/
├── public/
├── store/
└── providers.js
```

## Executando localmente

Clone o repositório:

```bash
git clone https://github.com/Ppedro-Leal/bookly-front.git
```

Acesse o diretório:

```bash
cd bookly-front
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias para os serviços utilizados pela aplicação.

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

## Equipe

Projeto desenvolvido academicamente por:

- Pedro Henrique Leal Amaral - https://linkedin.com/in/pedrohleal
- Marielly de Araújo Silva -  https://www.linkedin.com/in/mariellyaraujo/
- Luanna Evellyn Batista da Silva - https://www.linkedin.com/in/luanna-silva-bs/
- Vinicius da Silva Miranda - https://www.linkedin.com/in/viniciussmiranda/
- Maysa Clara Cavalcante da Silva - [https://www.linkedin.com/in/maysa-clara](https://www.linkedin.com/in/maysa-clara-cavalcante-5b1b7b2b7/)
- Helleson Allan Borges de Santana - 
- Arthur Marques da Silveira - https://www.linkedin.com/in/arthurmdsilveira/
- Saira Aguiar Rocha - [https://www.linkedin.com/in/saira-aguiar](https://www.linkedin.com/in/saira-aguiar-6584881a1/)

## Links

- Aplicação: https://bookly-front.vercel.app/
