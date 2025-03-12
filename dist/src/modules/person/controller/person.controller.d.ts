import { PersonService } from '../service/person.service';
import { Person } from '../entities/person.entity';
export declare class PersonController {
    private readonly personService;
    constructor(personService: PersonService);
    getPersons(): Promise<Person[]>;
    postPerson(person: Person): Promise<Person>;
    deletePerson(id: number): Promise<Person>;
}
