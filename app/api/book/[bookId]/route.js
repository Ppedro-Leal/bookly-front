import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACK4APP_API_URL;

const HEADERS_MASTER = {
  "X-Parse-Application-Id": process.env.NEXT_PUBLIC_BACK4APP_APP_ID,
  "X-Parse-Master-Key": process.env.BACK4APP_MASTER_KEY,
  "Content-Type": "application/json",
};


async function getSimilarBooks(categoryId, currentBookId) {
  if (!categoryId) return [];

  try {
    const whereClause = {
      category: {
        __type: "Pointer",
        className: "Category",
        objectId: categoryId,
      },
      objectId: {
        $ne: currentBookId,
      },
    };

    const whereQuery = encodeURIComponent(JSON.stringify(whereClause));

    const url = `${API_BASE_URL}/classes/Book?where=${whereQuery}&limit=4&include=category,genres,owner&order=-createdAt`;

    const response = await fetch(url, {
      headers: HEADERS_MASTER,
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(
        "Aviso: Falha ao buscar livros semelhantes",
        await response.json()
      );
      return [];
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar livros semelhantes:", error);
    return [];
  }
}



export async function GET(request, { params }) {

  const { bookId } = await params;

  if (!bookId) {

    return NextResponse.json({ error: "ID do livro ausente" }, { status: 400 });
  }

  try {
    const bookResponse = await fetch(
      `${API_BASE_URL}/classes/Book/${bookId}?include=category,genres,owner,state`,
      {
        headers: HEADERS_MASTER,
        cache: "no-store",
      }
    );

    if (!bookResponse.ok) {
      const error = await bookResponse.json();
      console.error("Erro Back4App:", error);
      return NextResponse.json(
        { error: error.error || "Livro não encontrado." },
        { status: bookResponse.status }
      );
    }

    const bookData = await bookResponse.json();

    const categoryId = bookData.category?.objectId;
    const similarBooks = categoryId
      ? await getSimilarBooks(categoryId, bookId)
      : [];

    return NextResponse.json({
      ...bookData,
      similarBooks,
    });
  } catch (error) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}