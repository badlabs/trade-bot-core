import {Router} from 'express'
import { getTradeBotFromExpress } from '../../../../../utils/express'

const router = Router();

router.get('/check', ((req, res) => {
    try {
        if (getTradeBotFromExpress(req).auth.authByRequest(req)) {
            res.send({
                status: 'Authorized',
                auth: true
            })
        } else {
            res.send({
                status: 'Not Authorized',
                auth: false
            })
        }
    }
    catch (e) {
        res.status(400).send(e)
    }
}))

export const authRouter = router
