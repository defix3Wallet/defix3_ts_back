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
exports.migration1678462338922 = void 0;
class migration1678462338922 {
    constructor() {
        this.name = 'migration1678462338922';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "transaction_history" ("id" SERIAL NOT NULL, "from_defix" character varying NOT NULL, "to_defix" character varying NOT NULL, "from_address" character varying NOT NULL, "to_address" character varying NOT NULL, "blockchain" character varying NOT NULL, "coin" character varying NOT NULL, "amount" double precision NOT NULL, "hash" character varying NOT NULL, "type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e2444ea77f6b5952b4ab7cb9a2" PRIMARY KEY ("id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "transaction_history"`);
        });
    }
}
exports.migration1678462338922 = migration1678462338922;
