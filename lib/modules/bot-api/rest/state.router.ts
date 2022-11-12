import {Router} from "express"
import {getTradeBotFromExpress, GetOperationsOptions, GetOrdersOptions, stringToOperationType} from "../../../utils";

const router = Router();

// Currencies

router.get('/currencies', (async (req, res) => {
  try {
    const currencies = await getTradeBotFromExpress(req).analyzer.getCurrencies()
    res.send(currencies)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/currencies', (async (req, res) => {
  try {
    const currencies = await getTradeBotFromExpress(req).analyzer.updateCurrencies()
    res.send(currencies)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

// Currencies Balance

router.get('/currencies/balance', (async (req, res) => {
  try {
    const currencies = await getTradeBotFromExpress(req).analyzer.getCurrenciesBalance()
    res.send(currencies)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/currencies/balance', (async (req, res) => {
  try {
    const currencies = await getTradeBotFromExpress(req).analyzer.updateCurrenciesBalance()
    res.send(currencies)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))


// Securities

router.get('/securities', (async (req, res) => {
  try {
    const securities = await getTradeBotFromExpress(req).analyzer.getSecurities()
    res.send(securities)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/securities', (async (req, res) => {
  try {
    const securities = await getTradeBotFromExpress(req).analyzer.updateSecurities()
    res.send(securities)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

// Followed Securities

router.get('/securities/followed', (async (req, res) => {
  try {
    const securities = await getTradeBotFromExpress(req).analyzer.getFollowedSecurities()
    res.send(securities)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/securities/followed', (async (req, res) => {
  try {
    const securities = await getTradeBotFromExpress(req).analyzer.updateFollowedSecurities()
    res.send(securities)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/securities/follow', (async (req, res) => {
  try {
    const securities = await getTradeBotFromExpress(req).analyzer.followSecurity(req.body.ticker)
    res.send(securities)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/securities/unfollow', (async (req, res) => {
  try {
    const securities = await getTradeBotFromExpress(req).analyzer.unfollowSecurity(req.body.ticker)
    res.send(securities)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

// Portfolio

router.get('/portfolio', (async (req, res) => {
  try {
    const portfolio = await getTradeBotFromExpress(req).analyzer.getPortfolio()
    res.send(portfolio)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/portfolio', (async (req, res) => {
  try {
    const portfolio = await getTradeBotFromExpress(req).analyzer.updatePortfolio()
    res.send(portfolio)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/portfolio/clear', (async (req, res) => {
  try {
    const clearedPositions = await getTradeBotFromExpress(req).analyzer.clearPortfolio()
    res.send(clearedPositions)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.get('/portfolio/:ticker/average-buy-price', (async (req, res) => {
  try {
    const price = await getTradeBotFromExpress(req).analyzer.getPositionAverageBuyPrice(req.params.ticker)
    res.send({ ticker: req.params.ticker, price })
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

// Operations

router.get('/operations', (async (req, res) => {
  try {
    const options: GetOperationsOptions = {
      from: req.query['from'] ? new Date(String(req.query['from']) ) : undefined,
      to: req.query['to'] ? new Date(String(req.query['to']) ) : undefined,
      securityTicker: req.query['securityTicker'] ? String(req.query['securityTicker']) : undefined,
      operation: req.query['operation'] ? String(req.query['operation']) : undefined
    }
    const portfolio = await getTradeBotFromExpress(req).analyzer.getOperations(options)
    res.send(portfolio)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/operations', (async (req, res) => {
  try {
    const from = req.body?.from ? new Date(String(req.body.from) ) : undefined
    const to = req.body?.to ? new Date(req.body.to) : undefined
    const portfolio = await getTradeBotFromExpress(req).analyzer
        .updateOperationsAll(from, to)
    res.send(portfolio)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

router.post('/operations/:ticker', (async (req, res) => {
  try {
    const portfolio = await getTradeBotFromExpress(req).analyzer.updateOperationsBySecurity(req.params.ticker)
    res.send(portfolio)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

// Orders

router.get('/orders', (async (req, res) => {
  try {
    const options: GetOrdersOptions = {
      from: req.query['from'] ? new Date(String(req.query['from']) ) : undefined,
      to: req.query['to'] ? new Date(String(req.query['to']) ) : undefined,
      securityTicker: req.query['securityTicker'] ? String(req.query['securityTicker']) : undefined,
      operation: req.query['operation'] ? stringToOperationType(String(req.query['operation'])) : undefined,
      runId: req.query['runId'] ? isNaN(Number(req.query['runId'])) ? undefined : Number(req.query['runId']) : undefined
    }
    const portfolio = await getTradeBotFromExpress(req).analyzer.getOrders(options)
    res.send(portfolio)
  }
  catch (e) {
    res.status(400).send(e)
  }
}))

export const stateRouter = router
