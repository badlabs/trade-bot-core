import {z} from "zod";
import {getOrderOptions} from "../../modules/bot-api/trpc/schemas";

export type GetOrderOptions = z.infer<typeof getOrderOptions>