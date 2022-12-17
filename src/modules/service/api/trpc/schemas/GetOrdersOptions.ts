import {z} from "zod";
import {operationType} from "./OperationType";

export const getOrdersOptions = z.object({
    from: z.date().optional(),
    to: z.date().optional(),
    securityTicker: z.string().optional(),
    operation: operationType.optional(),
    runId: z.number().int().min(0).optional()
})