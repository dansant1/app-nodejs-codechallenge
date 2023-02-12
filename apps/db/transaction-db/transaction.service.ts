import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
    Transaction,
} from './transaction.entity';
import { DatabaseService } from '../../services/db-connection/db-connection.service';


@Injectable()
export class TransactionDBService implements OnModuleInit {
    
    private transactionRepository: Repository<Transaction>;
    repositoriesLoaded: boolean;
    
    constructor(@Inject('DatabaseService') private dbService: DatabaseService) {}

    async makeConnection() {
        await this.dbService.init(
            {
                type: 'postgres',
                host: process.env.TYPEORM_HOST,
                port: parseInt(process.env.TYPEORM_PORT, 10),
                username: process.env.TYPEORM_PAYMENTS_INTEGRATION_USERNAME,
                password: process.env.TYPEORM_PAYMENTS_INTEGRATION_PASSWORD,
                database: process.env.TYPEORM_PAYMENTS_INTEGRATION_DATABASE,
                synchronize: process.env.SYNCHRONIZE_MIGRATIONS === 'true' ? true : false,
                logging: process.env.NODE_ENV === 'development' ? true : false,
                entities: [
                    'db/transaction-db/*.entity.ts'
                ],
                migrations: [
                    'db/transaction-db/migration/*.ts'
                ],
                cli: {
                  migrationsDir: 'db/transaction-db/migration',
                },
                ssl: process.env.DB_SSL_ENABLED === 'true' ? true : false,
                extra:
                  process.env.DB_SSL_ENABLED === 'true'
                    ? {
                        ssl: {
                          rejectUnauthorized: false,
                        },
                      }
                    : {},
                keepConnectionAlive: true,
              },
          process.env.TYPEORM_PAYMENTS_INTEGRATION_DATABASE,
        );
        await this.getAllRepositories();

    }

    async onModuleInit() {
        console.log('db started');
    }

    async getAllRepositories() {
        this.repositoriesLoaded = true;
        this.transactionRepository = this.dbService.getRepository(
            Transaction,
        );
    }

    async getConnection() {
        if (!this.dbService.connection) {
          await this.makeConnection();
        }
        if (!this.repositoriesLoaded) {
          await this.getAllRepositories();
        }
    }

    async create(data) {
        return this.transactionRepository.save(data);
    }

}
