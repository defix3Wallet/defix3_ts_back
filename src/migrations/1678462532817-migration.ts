import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1678462532817 implements MigrationInterface {
    name = 'migration1678462532817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history" RENAME COLUMN "type" TO "type_txn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_history" RENAME COLUMN "type_txn" TO "type"`);
    }

}
