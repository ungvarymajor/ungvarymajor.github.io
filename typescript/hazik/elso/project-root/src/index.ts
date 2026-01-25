import { Book } from "./classes/book";
import { Library } from "./classes/library";
import { User } from "./classes/user";

const library = new Library();

library.addBook(new Book(1, "A Pál utcai fiúk", "Molnár Ferenc", 3490));
library.addBook(new Book(2, "Egri csillagok", "Gárdonyi Géza", 3990));
library.addBook(new Book(3, "Az ember tragédiája", "Madách Imre", 2990));
library.addBook(new Book(4, "Az Állatfarm", "George Orwell", 4990));
library.addBook(new Book(5, "Az osztály vesztese", "Wéber Anikó", 3390));

console.log("Könyvek a könyvtárban (kezdetben):");
console.log(library.listAllBooks());

const user = new User("U001", "Példa Géza", "geza.pelda@mail.com");

console.log("\nFelhasználó kölcsönöz:");
const borrowed = user.borrowBook(library, 2);
console.log("Kikölcsönzött könyv:", borrowed);

console.log("\nKönyvek a könyvtárban (kölcsönzés után):");
console.log(library.listAllBooks());

console.log("\nKeresés ID alapján (3):");
console.log(library.findBookById(3));

console.log("\nEltávolítás (1):");
console.log("Sikeres törlés?", library.removeBook(1));

console.log("\nKönyvek a könyvtárban (törlés után):");
console.log(library.listAllBooks());
