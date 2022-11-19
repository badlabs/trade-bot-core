import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { AlgorithmRun } from "./AlgorithmRun"

export type InputTypes = {
    [key: string]: 'string' | 'number' | 'OrderDetails' | 'Date'
}

@Entity()
export class Algorithm {
    @PrimaryColumn("text")
    name: string

    @Column("text")
    description: string

    @Column("simple-json")
    inputTypes: InputTypes

    @OneToMany(() => AlgorithmRun, (run) => run.algorithm)
    algorithmRuns: AlgorithmRun[]

}