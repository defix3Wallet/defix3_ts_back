import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1678486318270 implements MigrationInterface {
    name = 'migration1678486318270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "dosfa" TO "twofa"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "twofa" TO "dosfa"`);
    }

}
