import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Digit } from '../entities/digit.entity';
import { Person } from '../../person/entities/person.entity';
import { createHash } from 'crypto';

@Injectable()
export class DigitService {
  constructor(
    @InjectRepository(Digit)
    private digitRepository: Repository<Digit>,
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  private generateCombinations(
    arr: number[][],
    index: number = 0,
    current: number[] = [],
    result: string[] = [],
  ) {
    if (index === arr.length) {
      const password = current.join('');
      const hash = createHash('sha256').update(password).digest('hex');
      result.push(hash);
      return;
    }

    for (const num of arr[index]) {
      this.generateCombinations(arr, index + 1, [...current, num], result);
    }

    return result;
  }

  async findOne(): Promise<Digit> {
    let sequence = await this.digitRepository
      .createQueryBuilder('seq')
      .where('seq.used = false')
      .orderBy('RANDOM()')
      .getOne();

    if (!sequence) {
      // Resetar todas as sequências para 'used = false'
      await this.digitRepository.update({}, { used: false });

      // Buscar uma nova sequência após o reset
      sequence = await this.digitRepository
        .createQueryBuilder('seq')
        .where('seq.used = false')
        .orderBy('RANDOM()')
        .getOne();
    }
    await this.digitRepository.update(sequence.id, { used: true });

    return sequence;
  }

  async login(password: Array<Array<number>>) {
    if (!password || password.length <= 0) {
      throw new BadRequestException('No password informed');
    }
    const combinations = this.generateCombinations(password);

    const person = await this.personRepository
      .createQueryBuilder('per')
      .where('per.password IN (:...combinations)', { combinations })
      .getOne();

    if (!person) {
      throw new UnauthorizedException('Invalid password');
    }

    delete person.password;

    return person;
  }

  async create(digit: Digit): Promise<Digit> {
    return await this.digitRepository.save(digit);
  }

  async delete(id: number): Promise<any> {
    return await this.digitRepository.delete(id);
  }
}
