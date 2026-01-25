import { Book } from "./book";
import { ILibrary } from "../interfaces/ILibrary";

export class Library implements ILibrary {
  public books: Book[] = [];

  addBook(book: Book): void {
    const existing = this.findBookById(book.id);
    if (existing) {
      throw new Error(`Már létezik könyv ezzel az ID-val: ${book.id}`);
    }
    this.books.push(book);
  }

  removeBook(id: number): boolean { 
    const originalLength = this.books.length;
    this.books = this.books.filter((b) => b.id !== id);
    return this.books.length !== originalLength;
  }

  findBookById(id: number): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  listAllBooks(): Book[] {
    return [...this.books];
  }
}
