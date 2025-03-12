import { DigitService } from '../service/digit.service';
import { Person } from '../../person/entities/person.entity';
type Password = {
    encryptedData: string;
    authTag: string;
};
export declare class DigitController {
    private readonly digitService;
    constructor(digitService: DigitService);
    getPersons(): Promise<any>;
    login(password: Password): Promise<Person>;
}
export {};
