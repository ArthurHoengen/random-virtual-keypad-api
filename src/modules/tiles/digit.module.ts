import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Digit } from './entities/digit.entity';
import { DigitController } from './controller/digit.controller';
import { DigitService } from './service/digit.service';
import { Person } from '../person/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Digit, Person])],
  controllers: [DigitController],
  providers: [DigitService],
})
export class DigitModule {}
