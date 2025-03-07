import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PersonService } from '../service/person.service';
import { Person } from '../entities/person.entity';
import { createHash } from 'crypto';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('/person')
  async getPersons(): Promise<Person[]> {
    return await this.personService.findAll();
  }

  // @Get('/person/:id')
  // getPersonById(@Param('id') id: string): string {
  //   console.log(id);
  //   return this.personService.getHello();
  // }

  @Post('/person')
  async postPerson(@Body() person: Person): Promise<Person> {
    return this.personService.create({
      ...person,
      password: createHash('sha256').update(person.password).digest('hex'),
    });
  }

  // @Put('/person')
  // updatePerson(): string {
  //   return this.personService.getHello();
  // }

  @Delete('/person/:id')
  async deletePerson(@Param('id') id: number): Promise<Person> {
    return this.personService.delete(id);
  }
}
