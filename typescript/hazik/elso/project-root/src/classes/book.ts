export class Book {
    public id: number;
    public title: string;
    public author: string;
    public price: number;
  
    constructor(id: number, title: string, author: string, price: number) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.price = price;
    }
  }