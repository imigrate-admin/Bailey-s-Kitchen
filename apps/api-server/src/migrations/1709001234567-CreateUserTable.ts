import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1709001234567 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable uuid-ossp extension for UUID generation
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "firstName",
                        type: "varchar"
                    },
                    {
                        name: "lastName",
                        type: "varchar"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "password",
                        type: "varchar"
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "deletedAt",
                        type: "timestamp",
                        isNullable: true
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
        await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}

