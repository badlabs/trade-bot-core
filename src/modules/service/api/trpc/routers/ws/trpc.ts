import {inferAsyncReturnType, initTRPC} from '@trpc/server'
import {CreateWSSContextFnOptions} from '@trpc/server/adapters/ws'
export const createContext = ({req, res}: CreateWSSContextFnOptions) => ({req}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create()

export const router = t.router
export const middleware = t.middleware
export const publicProcedure = t.procedure