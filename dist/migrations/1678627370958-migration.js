"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migration1678627370958 = void 0;
class migration1678627370958 {
    constructor() {
        this.name = 'migration1678627370958';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "frequent" ("id" SERIAL NOT NULL, "frequent_user" character varying, "userId" integer, CONSTRAINT "PK_a8d43caba57de5186d5191bf393" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "frequent" ADD CONSTRAINT "FK_8a97a1f6ec786e55bf00d60a677" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "frequent" DROP CONSTRAINT "FK_8a97a1f6ec786e55bf00d60a677"`);
            yield queryRunner.query(`DROP TABLE "frequent"`);
        });
    }
}
exports.migration1678627370958 = migration1678627370958;
