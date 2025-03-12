import { Repository } from 'typeorm';
import { Digit } from '../entities/digit.entity';
import { Person } from '../../person/entities/person.entity';
import { ConfigService } from '@nestjs/config';
export declare class DigitService {
    private digitRepository;
    private personRepository;
    private configService;
    constructor(digitRepository: Repository<Digit>, personRepository: Repository<Person>, configService: ConfigService);
    private generateCombinations;
    private encryptObject;
    private decryptObject;
    findOne(): Promise<any>;
    login(encryptedData: string, authTag: string): Promise<Person>;
    create(digit: Digit): Promise<Digit>;
    delete(id: number): Promise<any>;
}
