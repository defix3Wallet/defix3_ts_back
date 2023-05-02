"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migration1678462338922 = void 0;
class migration1678462338922 {
    constructor() {
        this.name = 'migration1678462338922';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "transaction_history" ("id" SERIAL NOT NULL, "from_defix" character varying NOT NULL, "to_defix" character varying NOT NULL, "from_address" character varying NOT NULL, "to_address" character varying NOT NULL, "blockchain" character varying NOT NULL, "coin" character varying NOT NULL, "amount" double precision NOT NULL, "hash" character varying NOT NULL, "type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e2444ea77f6b5952b4ab7cb9a2" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "transaction_history"`);
    }
}
exports.migration1678462338922 = migration1678462338922;
