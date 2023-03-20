import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1679323940197 implements MigrationInterface {
    name = 'migration1679323940197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "passcode" integer`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD "type_transaction" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frequent" DROP COLUMN "type_transaction"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passcode"`);
    }

}
