import {db} from "../db";
import {store} from "../store";
import {BotLogger} from "../modules";

export const globalStore = {
    db: db,
    store: store,
    logger: null as BotLogger | null,
    config: {}
}