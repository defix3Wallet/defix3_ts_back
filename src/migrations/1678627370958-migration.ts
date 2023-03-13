import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1678627370958 implements MigrationInterface {
    name = 'migration1678627370958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "frequent" ("id" SERIAL NOT NULL, "frequent_user" character varying, "userId" integer, CONSTRAINT "PK_a8d43caba57de5186d5191bf393" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD CONSTRAINT "FK_8a97a1f6ec786e55bf00d60a677" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "frequent" DROP CONSTRAINT "FK_8a97a1f6ec786e55bf00d60a677"`);
        await queryRunner.query(`DROP TABLE "frequent"`);
    }

}
