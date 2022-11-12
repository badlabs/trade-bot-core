import {Router} from "express";
import {awaitTime, getTradeBotFromExpress} from "../../../utils";

const router = Router();

router.get('/', (req, res) => {
    try {
        res.send(getTradeBotFromExpress(req).analyzer.tradeAlgos.description)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/:algoritmName/runs', async (req, res) => {
    try {
        res.send(await getTradeBotFromExpress(req).analyzer.getAlgorithmRunsByAlgorithm(req.params.algoritmName))
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/:algoritmName', async (req, res) => {
    try {
        const algoName = req.params.algoritmName
        const inputs: any = req.body
        res.send(await getTradeBotFromExpress(req).analyzer.tradeAlgos.runAlgorithm(algoName, inputs))
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/:algoritmName/stop/:id', async (req, res) => {
    try {
        const algoName = req.params.algoritmName
        const id = +req.params.id
        res.send(await getTradeBotFromExpress(req).analyzer.tradeAlgos.stopAlgorithm(algoName, id))
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/:algoritmName/continue/:id', async (req, res) => {
    try {
        const algoName = req.params.algoritmName
        const id = +req.params.id
        res.send(await getTradeBotFromExpress(req).analyzer.tradeAlgos.continueAlgorithm(algoName, id))
    } catch (e) {
        res.status(403).send(e)
    }

})

export const algosRouter = router
