import {AlgorithmRun as T} from "../../db";

export type AlgorithmRun = Omit<T, 'status'> & {
    status: 'running' | 'stopped' | 'continued' | 'finished' | 'error'
}
