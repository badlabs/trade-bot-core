import {ITypedTransformer} from "./ITypedTransformer"

export const dateTransformer: ITypedTransformer<Date, number> = {
    to: (value: Date) => Number(value),
    from: (value: number) => new Date(value)
} as const