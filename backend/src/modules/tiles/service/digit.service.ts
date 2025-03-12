import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Digit } from '../entities/digit.entity';
import { Person } from '../../person/entities/person.entity';
import { createHash, createCipheriv, createDecipheriv } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DigitService {
  constructor(
    @InjectRepository(Digit)
    private digitRepository: Repository<Digit>,
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    private configService: ConfigService,
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

  private encryptObject(obj) {
    const key = Buffer.from(
      String(this.configService.get('ENCRYPTION_KEY')),
      'base64',
    ); // 32 bytes
    const iv = Buffer.from(
      String(this.configService.get('ENCRYPTION_IV')),
      'hex',
    ); // 12 bytes
    const jsonString = JSON.stringify(obj);
    const cipher = createCipheriv('aes-256-gcm', key, iv);

    let encrypted = cipher.update(jsonString, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encryptedData: encrypted,
      authTag: authTag,
    };
  }

  private decryptObject(encryptedData, authTag): any {
    const key = Buffer.from(
      'dDNeJXx6kALUwgKkywRMVvLV2XeNE+Ehdq13ZrAK2f8=',
      'base64',
    ); // 32 bytes
    const iv = Buffer.from('b1b26cb8b662ed6fa4ed0d8f', 'hex'); // 12 bytes
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted); 
  }

  async findOne(): Promise<any> {
    let sequence = await this.digitRepository
      .createQueryBuilder('seq')
      .where('seq.used = false')
      .orderBy('RANDOM()')
      .getOne();

    if (!sequence) {
      await this.digitRepository.update({}, { used: false });

      sequence = await this.digitRepository
        .createQueryBuilder('seq')
        .where('seq.used = false')
        .orderBy('RANDOM()')
        .getOne();
    }
    await this.digitRepository.update(sequence.id, { used: true });

    return this.encryptObject(sequence);
  }

  async login(encryptedData: string, authTag: string): Promise<Person> {
    const { password } = this.decryptObject(encryptedData, authTag);
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
