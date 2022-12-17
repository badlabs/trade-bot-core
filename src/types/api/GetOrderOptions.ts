import {z} from "zod";
import {getOrdersOptions} from "../../modules/service/api/trpc/schemas";

export type GetOrdersOptions = z.infer<typeof getOrdersOptions>