import {Entity, Column, ManyToOne, UpdateDateColumn, PrimaryColumn} from "typeorm"
import {AlgorithmRun} from "./AlgorithmRun";
import {dateTransformer} from "./transformers";
import {z} from "zod";
import {operationType} from "../modules/service/api/trpc/schemas";

export type OrderStatus = 'not_processed' | 'to_be_processed' | 'placed' | 'units_allocated' |
    'units_redeemed' | 'rejected' | 'cancelled' | 'expired' | 'undefined'
export type OperationType = z.infer<typeof operationType>

@Entity()
export class Order {
    @PrimaryColumn()
    exchangeId: string

    @Column()
    securityTicker: string

    /**
     * [Statuses details]{@link https://support.tradeplusonline.com/support/solutions/articles/1000254592-what-are-the-different-order-status-possible-of-an-order-}
     */
    @Column()
    status: OrderStatus = 'undefined'

    @Column()
    operation: OperationType = 'undefined'

    @Column('int')
    lots: number

    @Column('float')
    price: number

    @UpdateDateColumn({
        type: 'int',
        transformer: dateTransformer
    })
    updatedAt?: Date = new Date()

    @Column({ type: 'int', nullable: false})
    algorithmRunId?: number

    @ManyToOne(() => AlgorithmRun, (run) => run.orders)
    algorithmRun?: AlgorithmRun
}