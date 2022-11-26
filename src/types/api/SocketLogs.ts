export type SocketLogs = {
    robot_id: string
    type: 'info' | 'error' | 'warning'
    message: string
    attachment?: any
    algorithm?: {
        name: string
        run_id?: number
        inputs?: any
        state?: any
    }
    timestamp: string
}