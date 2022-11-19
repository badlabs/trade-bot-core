import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm"
import { Algorithm } from "./Algorithm"
import {Order} from "./Order";

@Entity()
export class AlgorithmRun<InputType = unknown, StateType = InputType> {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    algorithmName: string

    @Column('simple-json')
    inputs: InputType

    @Column('text')
    status: 'running' | 'stopped' | 'resumed' | 'finished' | 'error'

    @Column('simple-json')
    state: StateType

    @UpdateDateColumn()
    updatedAt: Date

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Algorithm, (algo) => algo.algorithmRuns)
    algorithm: Algorithm

    @OneToMany(() => Order, (order) => order.algorithmRun)
    orders: Order[]
}