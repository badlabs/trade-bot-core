import {CreateOrderOptions} from '../../../../src'
import {Job} from 'node-schedule'

export type HammerInput = {
    order: CreateOrderOptions,
    date: Date,
    seconds_before: number
}
export type HammerState = {
    send_date: Date
}
export type HammerStopData = {
    job: Job
}