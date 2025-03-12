"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const digit_entity_1 = require("../entities/digit.entity");
const person_entity_1 = require("../../person/entities/person.entity");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
let DigitService = class DigitService {
    constructor(digitRepository, personRepository, configService) {
        this.digitRepository = digitRepository;
        this.personRepository = personRepository;
        this.configService = configService;
    }
    generateCombinations(arr, index = 0, current = [], result = []) {
        if (index === arr.length) {
            const password = current.join('');
            const hash = (0, crypto_1.createHash)('sha256').update(password).digest('hex');
            result.push(hash);
            return;
        }
        for (const num of arr[index]) {
            this.generateCombinations(arr, index + 1, [...current, num], result);
        }
        return result;
    }
    encryptObject(obj) {
        const key = Buffer.from(String(this.configService.get('ENCRYPTION_KEY')), 'base64');
        const iv = Buffer.from(String(this.configService.get('ENCRYPTION_IV')), 'hex');
        const jsonString = JSON.stringify(obj);
        const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', key, iv);
        let encrypted = cipher.update(jsonString, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');
        return {
            encryptedData: encrypted,
            authTag: authTag,
        };
    }
    decryptObject(encryptedData, authTag) {
        const key = Buffer.from('dDNeJXx6kALUwgKkywRMVvLV2XeNE+Ehdq13ZrAK2f8=', 'base64');
        const iv = Buffer.from('b1b26cb8b662ed6fa4ed0d8f', 'hex');
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', key, iv);
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
    async findOne() {
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
    async login(encryptedData, authTag) {
        const { password } = this.decryptObject(encryptedData, authTag);
        if (!password || password.length <= 0) {
            throw new common_1.BadRequestException('No password informed');
        }
        const combinations = this.generateCombinations(password);
        const person = await this.personRepository
            .createQueryBuilder('per')
            .where('per.password IN (:...combinations)', { combinations })
            .getOne();
        if (!person) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        delete person.password;
        return person;
    }
    async create(digit) {
        return await this.digitRepository.save(digit);
    }
    async delete(id) {
        return await this.digitRepository.delete(id);
    }
};
exports.DigitService = DigitService;
exports.DigitService = DigitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(digit_entity_1.Digit)),
    __param(1, (0, typeorm_1.InjectRepository)(person_entity_1.Person)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], DigitService);
