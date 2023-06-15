import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1686583495788 implements MigrationInterface {
    name = 'migration1686583495788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "adresses" DROP CONSTRAINT "FK_b4f5c94493f23641866f161e212"`);
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_414a454532d03cd17f4ef40eae2"`);
        await queryRunner.query(`ALTER TABLE "frequent" DROP CONSTRAINT "FK_8a97a1f6ec786e55bf00d60a677"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "frequent" DROP CONSTRAINT "PK_a8d43caba57de5186d5191bf393"`);
        await queryRunner.query(`ALTER TABLE "frequent" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD CONSTRAINT "PK_a8d43caba57de5186d5191bf393" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "frequent" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "adresses" DROP CONSTRAINT "PK_2787c84f7433e390ff8961d552d"`);
        await queryRunner.query(`ALTER TABLE "adresses" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "adresses" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "adresses" ADD CONSTRAINT "PK_2787c84f7433e390ff8961d552d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "adresses" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "adresses" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "hidden_tokens_limit" DROP CONSTRAINT "PK_9267eececf01938277f4957727c"`);
        await queryRunner.query(`ALTER TABLE "hidden_tokens_limit" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "hidden_tokens_limit" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "hidden_tokens_limit" ADD CONSTRAINT "PK_9267eececf01938277f4957727c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "PK_a87248d73155605cf782be9ee5e"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP CONSTRAINT "PK_1e2444ea77f6b5952b4ab7cb9a2"`);
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD CONSTRAINT "PK_1e2444ea77f6b5952b4ab7cb9a2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "PK_74904758e813e401abc3d4261c2"`);
        await queryRunner.query(`ALTER TABLE "balances" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "balances" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "balances" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "balances" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD CONSTRAINT "FK_8a97a1f6ec786e55bf00d60a677" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adresses" ADD CONSTRAINT "FK_b4f5c94493f23641866f161e212" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "FK_414a454532d03cd17f4ef40eae2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_414a454532d03cd17f4ef40eae2"`);
        await queryRunner.query(`ALTER TABLE "adresses" DROP CONSTRAINT "FK_b4f5c94493f23641866f161e212"`);
        await queryRunner.query(`ALTER TABLE "frequent" DROP CONSTRAINT "FK_8a97a1f6ec786e55bf00d60a677"`);
        await queryRunner.query(`ALTER TABLE "balances" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "balances" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "PK_74904758e813e401abc3d4261c2"`);
        await queryRunner.query(`ALTER TABLE "balances" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "balances" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP CONSTRAINT "PK_1e2444ea77f6b5952b4ab7cb9a2"`);
        await queryRunner.query(`ALTER TABLE "transaction_history" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction_history" ADD CONSTRAINT "PK_1e2444ea77f6b5952b4ab7cb9a2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "PK_a87248d73155605cf782be9ee5e"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "hidden_tokens_limit" DROP CONSTRAINT "PK_9267eececf01938277f4957727c"`);
        await queryRunner.query(`ALTER TABLE "hidden_tokens_limit" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "hidden_tokens_limit" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hidden_tokens_limit" ADD CONSTRAINT "PK_9267eececf01938277f4957727c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "adresses" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "adresses" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "adresses" DROP CONSTRAINT "PK_2787c84f7433e390ff8961d552d"`);
        await queryRunner.query(`ALTER TABLE "adresses" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "adresses" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "adresses" ADD CONSTRAINT "PK_2787c84f7433e390ff8961d552d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "frequent" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "frequent" DROP CONSTRAINT "PK_a8d43caba57de5186d5191bf393"`);
        await queryRunner.query(`ALTER TABLE "frequent" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD CONSTRAINT "PK_a8d43caba57de5186d5191bf393" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "frequent" ADD CONSTRAINT "FK_8a97a1f6ec786e55bf00d60a677" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "FK_414a454532d03cd17f4ef40eae2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adresses" ADD CONSTRAINT "FK_b4f5c94493f23641866f161e212" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
