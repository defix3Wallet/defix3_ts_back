import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1687879616654 implements MigrationInterface {
    name = 'migration1687879616654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "language" character varying DEFAULT 'EN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "language"`);
    }

}
