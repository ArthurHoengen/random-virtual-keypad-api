import { Body, Controller, Get, Post } from '@nestjs/common';
import { Digit } from '../entities/digit.entity';
import { DigitService } from '../service/digit.service';
import { Person } from '../../person/entities/person.entity';

type Password = {
  password: number[][];
};

@Controller()
export class DigitController {
  constructor(private readonly digitService: DigitService) {}

  @Get('/digits')
  async getPersons(): Promise<Digit> {
    return await this.digitService.findOne();
  }

  @Post('/login')
  async login(@Body() password: Password): Promise<Person> {
    return await this.digitService.login(password.password);
  }
}
