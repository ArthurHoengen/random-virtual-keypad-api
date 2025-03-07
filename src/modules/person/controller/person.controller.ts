import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PersonService } from '../service/person.service';
import { Person } from '../entities/person.entity';

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
  async postPerson(): Promise<Person> {
    return this.personService.create({
      firstName: 'Arthur',
      lastName: 'Hoengen',
      password: 'Teste',
    });
  }

  // @Put('/person')
  // updatePerson(): string {
  //   return this.personService.getHello();
  // }

  // @Delete('/person/:id')
  // deletePerson(@Param('id') id: string): string {
  //   return this.personService.getHello();
  // }
}
