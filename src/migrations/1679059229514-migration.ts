import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1679059229514 implements MigrationInterface {
    name = 'migration1679059229514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_send"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_receive"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_dex"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_fiat"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_news" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_deposit" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_sign" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_withdrawal" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_evolution" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_evolution"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_withdrawal"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_sign"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_deposit"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "flag_news"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_fiat" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_dex" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_receive" boolean`);
        await queryRunner.query(`ALTER TABLE "users" ADD "flag_send" boolean`);
    }

}
