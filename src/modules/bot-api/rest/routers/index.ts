import {NextFunction, Request, Response, Router} from 'express'
import {getTradeBotFromExpress} from '../../../../utils/rest'
import {authRouter} from './auth.router'
import {algosRouter} from './algorithms.router'
import {stateRouter} from './state.router'

const router = Router()

router.use('/auth', authRouter)
router.use((req: Request, res: Response, next: NextFunction) => {
    if (getTradeBotFromExpress(req).auth.authByRequest(req)) next()
    else res.status(401).send('Error: Not Authorized')
})
router.use('/algos', algosRouter)
router.use('/state', stateRouter)

export const apiRouter = router