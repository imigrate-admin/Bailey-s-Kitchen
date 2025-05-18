import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePetCategoryEnum1684334400000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, remove the default constraint
        await queryRunner.query(`
            ALTER TABLE products ALTER COLUMN category DROP DEFAULT;
        `);

        // Update enum values to uppercase
        await queryRunner.query(`
            ALTER TYPE products_category_enum RENAME TO products_category_enum_old;
            CREATE TYPE products_category_enum AS ENUM ('DOG', 'CAT', 'BIRD', 'FISH', 'SMALL_ANIMAL');
            
            ALTER TABLE products
            ALTER COLUMN category TYPE products_category_enum 
            USING UPPER(category::text)::products_category_enum;
            
            DROP TYPE products_category_enum_old;
        `);

        // Add back the default constraint with the new uppercase value
        await queryRunner.query(`
            ALTER TABLE products ALTER COLUMN category SET DEFAULT 'DOG'::products_category_enum;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // First, remove the default constraint
        await queryRunner.query(`
            ALTER TABLE products ALTER COLUMN category DROP DEFAULT;
        `);

        // Revert enum values to lowercase
        await queryRunner.query(`
            ALTER TYPE products_category_enum RENAME TO products_category_enum_old;
            CREATE TYPE products_category_enum AS ENUM ('dog', 'cat', 'bird', 'fish', 'small_animal');
            
            ALTER TABLE products
            ALTER COLUMN category TYPE products_category_enum 
            USING LOWER(category::text)::products_category_enum;
            
            DROP TYPE products_category_enum_old;
        `);

        // Add back the default constraint with the original lowercase value
        await queryRunner.query(`
            ALTER TABLE products ALTER COLUMN category SET DEFAULT 'dog'::products_category_enum;
        `);
    }
} 