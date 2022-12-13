import {z} from "zod";
import {getOrdersOptions} from "../../modules/bot-api/trpc/schemas";

export type GetOrdersOptions = z.infer<typeof getOrdersOptions>