"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migration1678462532817 = void 0;
class migration1678462532817 {
    constructor() {
        this.name = 'migration1678462532817';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction_history" RENAME COLUMN "type" TO "type_txn"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction_history" RENAME COLUMN "type_txn" TO "type"`);
    }
}
exports.migration1678462532817 = migration1678462532817;
