import {Book} from "../book.js";

/** Composition of domain (`Book`) and external data (`availability`). */
export default class BookAvailability {
    constructor(public readonly book: Book, public readonly availableCopies: number) {}
}