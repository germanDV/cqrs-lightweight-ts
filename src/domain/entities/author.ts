import {randomUUID} from "node:crypto";
import {DomainEvent} from "./events/domain_event.js";
import AuthorCreatedEvent from "./events/author_created_event.js";
import BibliographyIncreasedEvent from "./events/bibliography_increased.js";

export class Author {
    public readonly id: string
    private _name: string
    private _bio?: string
    private _booksPublishedCount: number

    private constructor(name: string, bio: string | undefined) {
        this.id = randomUUID()
        this._name = name
        this._bio = bio
        this._booksPublishedCount = 0
    }

    public static create(
        name: string,
        bio: string | undefined,
    ): { author: Author, events: Array<DomainEvent> } {
        const author = new Author(name, bio)
        const event = new AuthorCreatedEvent(author.id, new Date())
        return { author, events: [event] }
    }

    public get name(): string {
        return this._name
    }

    public get bio(): string | undefined {
        return this._bio
    }

    public get booksPublishedCount(): number {
        return this._booksPublishedCount
    }

    public incrementPublishedBookCount(): { events: Array<DomainEvent> } {
        this._booksPublishedCount++
        const event = new BibliographyIncreasedEvent(this.id, new Date(), this._booksPublishedCount)
        return { events: [event] }
    }
}
