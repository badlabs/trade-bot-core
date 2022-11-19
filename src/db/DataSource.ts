import { DataSource } from 'typeorm'
import {AlgorithmRun} from "./AlgorithmRun";
import {Algorithm} from "./Algorithm";
import {Order} from "./Order";

export const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: './storage.db',
    logging: false,
    synchronize: true,
    entities: [Algorithm, AlgorithmRun, Order]
})