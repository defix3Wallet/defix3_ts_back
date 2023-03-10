import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1678462338922 implements MigrationInterface {
    name = 'migration1678462338922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_history" ("id" SERIAL NOT NULL, "from_defix" character varying NOT NULL, "to_defix" character varying NOT NULL, "from_address" character varying NOT NULL, "to_address" character varying NOT NULL, "blockchain" character varying NOT NULL, "coin" character varying NOT NULL, "amount" double precision NOT NULL, "hash" character varying NOT NULL, "type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e2444ea77f6b5952b4ab7cb9a2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction_history"`);
    }

}
