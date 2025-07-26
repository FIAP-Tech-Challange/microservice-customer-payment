import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePayment1747837944990 implements MigrationInterface {
  name = 'CreateTablePayment1747837944990';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" character varying NOT NULL, "store_id" character varying NOT NULL, "payment_type" character varying NOT NULL, "status" character varying NOT NULL, "total" integer NOT NULL, "external_id" character varying NOT NULL, "qr_code" character varying NOT NULL, "plataform" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment"`);
  }
}
