import {db} from "../db";
import {store} from "../store";
import {LoggerService} from "../modules";

export const globalStore = {
    db: db,
    store: store,
    logger: null as LoggerService | null,
    config: {}
}