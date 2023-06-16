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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "defix_id",
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "defixId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "import_id",
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "importId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "close_sessions",
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "closeSessions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: false,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "twofa", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "legal_document",
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "legalDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "type_document",
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "typeDocument", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "flag_news",
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "flagNews", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "flag_deposit",
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "flagDeposit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "flag_sign",
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "flagSign", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "flag_withdrawal",
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "flagWithdraw", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "flag_evolution",
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "flagEvolution", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: "created_at",
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: "updated_at",
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
UserEntity = __decorate([
    (0, typeorm_1.Entity)({ name: "users" })
], UserEntity);
exports.UserEntity = UserEntity;
