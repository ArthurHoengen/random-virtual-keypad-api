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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonController = void 0;
const common_1 = require("@nestjs/common");
const person_service_1 = require("../service/person.service");
const person_entity_1 = require("../entities/person.entity");
const crypto_1 = require("crypto");
let PersonController = class PersonController {
    constructor(personService) {
        this.personService = personService;
    }
    async getPersons() {
        return await this.personService.findAll();
    }
    async postPerson(person) {
        return this.personService.create({
            ...person,
            password: (0, crypto_1.createHash)('sha256').update(person.password).digest('hex'),
        });
    }
    async deletePerson(id) {
        return this.personService.delete(id);
    }
};
exports.PersonController = PersonController;
__decorate([
    (0, common_1.Get)('/person'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "getPersons", null);
__decorate([
    (0, common_1.Post)('/person'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [person_entity_1.Person]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "postPerson", null);
__decorate([
    (0, common_1.Delete)('/person/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "deletePerson", null);
exports.PersonController = PersonController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [person_service_1.PersonService])
], PersonController);
