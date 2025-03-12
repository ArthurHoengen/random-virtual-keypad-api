import { Person } from '../entities/person.entity';
import { Repository } from 'typeorm';
export declare class PersonService {
    private personRepository;
    constructor(personRepository: Repository<Person>);
    findAll(): Promise<Person[]>;
    create(person: Person): Promise<Person>;
    delete(id: number): Promise<Person>;
}
