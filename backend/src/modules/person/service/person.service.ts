import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  async findAll(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  async create(person: Person): Promise<Person> {
    return await this.personRepository.save(person);
  }

  async delete(id: number): Promise<Person> {
    const person = await this.personRepository.findOneBy({ id: id });
    await this.personRepository.delete(person);
    return person;
  }
}
