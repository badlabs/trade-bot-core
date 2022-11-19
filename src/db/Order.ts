import { Entity, Column, ManyToOne, UpdateDateColumn } from "typeorm"
import {AlgorithmRun} from "./AlgorithmRun";

type OrderStatus = 'not_processed' | 'to_be_processed' | 'placed' | 'units_allocated' |
    'units_redeemed' | 'rejected' | 'cancelled' | 'expired' | 'undefined'
export type OperationType = 'limit_buy' | 'limit_sell' |
    'market_buy' | 'market_sell' |
    'buy_or_cancel' | 'sell_or_cancel' | 'undefined'

@Entity()
export class Order {
    @Column({
        type: "text",
        nullable: true,
        unique: true
    })
    exchangeId?: string

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

    @UpdateDateColumn()
    updatedAt: Date

    @Column({ type: 'int', nullable: false})
    algorithmRunId?: number

    @ManyToOne(() => AlgorithmRun, (run) => run.orders)
    algorithmRun?: AlgorithmRun
}