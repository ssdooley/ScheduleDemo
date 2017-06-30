import { Person } from './person.model';
import { Category } from './category.model';

export class Commitment {
    id: number;
    location: string;
    subject: string;
    body: string;
    startDate: Date;
    endDate: Date;
    category: Category;
    people: Person[];
}