import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1683327305047 implements MigrationInterface {
    name = 'migration1683327305047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hidden_tokens_limit" ("id" SERIAL NOT NULL, "user" character varying NOT NULL, "token_id" integer NOT NULL, CONSTRAINT "PK_9267eececf01938277f4957727c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "hidden_tokens_limit"`);
    }

}
