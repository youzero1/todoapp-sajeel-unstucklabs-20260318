import "reflect-metadata";
import { DataSource } from "typeorm";
import { Todo } from "../entities/Todo";
import path from "path";
import fs from "fs";

const DATABASE_PATH = process.env.DATABASE_PATH || "./data/todos.db";

// Ensure the directory exists
const dbDir = path.dirname(path.resolve(DATABASE_PATH));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "better-sqlite3",
    database: path.resolve(DATABASE_PATH),
    synchronize: true,
    logging: false,
    entities: [Todo]
  });

  await dataSource.initialize();
  return dataSource;
}
