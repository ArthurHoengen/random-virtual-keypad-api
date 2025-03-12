import { Body, Controller, Get, Post } from '@nestjs/common';
import { DigitService } from '../service/digit.service';
import { Person } from '../../person/entities/person.entity';

type Password = {
  encryptedData: string;
  authTag: string;
};

@Controller()
export class DigitController {
  constructor(private readonly digitService: DigitService) {}

  @Get('/digits')
  async getPersons(): Promise<any> {
    return await this.digitService.findOne();
  }

  @Post('/login')
  async login(@Body() password: Password): Promise<Person> {
    return await this.digitService.login(
      password.encryptedData,
      password.authTag,
    );
  }
}
