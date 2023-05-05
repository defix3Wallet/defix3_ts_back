import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1683311770312 implements MigrationInterface {
    name = 'migration1683311770312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passcode"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "passcode" integer`);
    }

}
