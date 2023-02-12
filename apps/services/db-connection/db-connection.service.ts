import { Connection, EntitySchema, getConnectionManager } from 'typeorm';
import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ObjectType } from 'typeorm/common/ObjectType';
import { v4 as uuid } from 'uuid';

export const getDbConfig = async (username: string) => {
    return {
        password: '123',
        username: '1212',
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      };
};

const meta = { context: 'DatabaseService' };

@Injectable()
export class DatabaseService implements OnModuleDestroy, OnApplicationShutdown {
  get connection(): any {
    const manager = getConnectionManager();
    return manager.connections[0];
  }

  get manager() {
    return getConnectionManager();
  }

  private static async closeConnections(connections: Connection[]) {
    await Promise.all(
      connections.map(async (connection) => {
        if (connection.isConnected) {
          await connection.close();
        }
      }),
    );
    return connections;
  }

  removeOldConnections(newConnection: Connection) {
    const manager = this.manager;
    const removedConnections = [
      ...manager.connections.splice(0, this.getConnectionIndex(newConnection)),
      ...manager.connections.splice(1, manager.connections.length - 1),
    ];
    if (removedConnections.length) {
      return DatabaseService.closeConnections(removedConnections)
        .then((connections) =>
          console.log(
            `closed old database connection(s): ${connections
              .map((c) => c.name)
              .join(', ')}`,
            { meta },
          ),
        )
        .catch((err) => console.error(err.message || err, err.stack, { meta }));
    }
  }

  getRepository<Entity>(
    target: ObjectType<Entity> | EntitySchema<Entity> | string,
  ) {
    return this.connection.getRepository(target);
  }

  async createConnection(options: PostgresConnectionOptions) {
    const name = uuid();
    console.log(
      `creating new database connection '${name}': ${options.username}@${options.host}/${options.database}`,
      { meta },
    );
    return this.manager.create({
      ...options,
      name,
    });
  }

  async init(config, username) {
    const dbConfig = await getDbConfig(username);
    const manager = this.manager;
    const newConnection = await this.createConnection({
      ...config,
      ...dbConfig,
    });
    const newConnectionIndex = this.getConnectionIndex(newConnection);
    try {
      await this.removeOldConnections(newConnection);
      await newConnection.connect();
    } catch (error) {
      console.log(`error from db connection ${JSON.stringify(error)}`);
      manager.connections.splice(newConnectionIndex, 1);
    }
  }

  async onModuleDestroy() {
    await this.cleanup();
  }

  async onApplicationShutdown() {
    await this.cleanup();
  }

  getConnectionIndex(connection: Connection) {
    return this.manager.connections.indexOf(connection);
  }

  private async cleanup() {
    const { connections } = getConnectionManager();
    await DatabaseService.closeConnections(
      connections.splice(0, connections.length),
    );
  }
}
