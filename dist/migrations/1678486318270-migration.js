"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migration1678486318270 = void 0;
class migration1678486318270 {
    constructor() {
        this.name = 'migration1678486318270';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "dosfa" TO "twofa"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "twofa" TO "dosfa"`);
    }
}
exports.migration1678486318270 = migration1678486318270;
