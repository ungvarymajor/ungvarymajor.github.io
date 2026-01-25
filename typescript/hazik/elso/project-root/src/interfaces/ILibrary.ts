import { Book } from "../classes/book";

export interface ILibrary {
  addBook(book: Book): void;
  removeBook(id: number): boolean;
  findBookById(id: number): Book | undefined;
  listAllBooks(): Book[];
}