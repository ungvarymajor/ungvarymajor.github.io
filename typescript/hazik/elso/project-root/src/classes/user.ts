import { Library } from "./library";
import { Book } from "./book";

export class User {
  public userId: string;
  public name: string;
  public email: string;

  constructor(userId: string, name: string, email: string) {
    this.userId = userId;
    this.name = name;
    this.email = email;
  }

  borrowBook(library: Library, bookId: number): Book {
    const book = library.findBookById(bookId);

    if (!book) {
      throw new Error(`A könyv nem található ezzel az ID-val: ${bookId}`);
    }

    library.removeBook(bookId);
    return book;
  }
}
