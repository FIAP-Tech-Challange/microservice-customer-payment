import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTypeProducts1748306724937 implements MigrationInterface {
  name = 'AlterTypeProducts1748306724937';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "totems" DROP CONSTRAINT "FK_fe0cbebb6b630a64890be9eca6f"`,
    );
    await queryRunner.query(`ALTER TABLE "totems" ADD "storeId" uuid`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category_id"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "category_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "store_id"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "store_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "totems" DROP COLUMN "store_id"`);
    await queryRunner.query(
      `ALTER TABLE "totems" ADD "store_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "totems" ADD CONSTRAINT "FK_b5b89617d47050044df844f6377" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "totems" DROP CONSTRAINT "FK_b5b89617d47050044df844f6377"`,
    );
    await queryRunner.query(`ALTER TABLE "totems" DROP COLUMN "store_id"`);
    await queryRunner.query(
      `ALTER TABLE "totems" ADD "store_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "store_id"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "store_id" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category_id"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "category_id" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "totems" DROP COLUMN "storeId"`);
    await queryRunner.query(
      `ALTER TABLE "totems" ADD CONSTRAINT "FK_fe0cbebb6b630a64890be9eca6f" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
