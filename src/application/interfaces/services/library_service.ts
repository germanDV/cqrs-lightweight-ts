import {ISBN} from "../../../domain/entities/value_objects/isbn.ts";

export interface ILibraryService {
    /** Returns the number of copies available in the library. */
    getAvailableCopies(isbn: ISBN): Promise<number>
}