import {TradeBot} from "../../../TradeBot";
import {CompatibleService} from "json-rpc-ts-wrapper";
import {GetOrdersOptions} from "../../../types";

export function initServiceMethods(tradeBot: TradeBot){

    return {
        // ===============
        // Algorithms
        // ===============
        getAlgorithms(){ return tradeBot.analyzer.tradeAlgos.description },
        async getAlgorithmRuns(params: {
            algorithmName: string
        }){
            const { algorithmName } = params
            return await tradeBot.analyzer.getAlgorithmRunsByAlgorithm(algorithmName)
        },
        async runAlgorithm(params: {
            algorithmName: string,
            inputs: any
        }){
            const { algorithmName, inputs } = params
            // TODO: Provide types for different algorithms
            return await tradeBot.analyzer.tradeAlgos.runAlgorithm(algorithmName, inputs)
        },
        async stopAlgorithm(params: {
            algorithmName: string,
            id: number
        }){
            const { algorithmName, id } = params
            return await tradeBot.analyzer.tradeAlgos.stopAlgorithm(algorithmName, id)
        },
        async resumeAlgorithm(params: {
            algorithmName: string,
            id: number
        }){
            const { algorithmName, id } = params
            return await tradeBot.analyzer.tradeAlgos.continueAlgorithm(algorithmName, id)
        },
        // ===============
        // State
        // ===============
        // Currencies
        async getCurrencies(){ return await tradeBot.analyzer.getCurrencies() },
        async updateCurrencies() { return await tradeBot.analyzer.updateCurrencies() },
        async getCurrenciesBalance() { return await tradeBot.analyzer.getCurrenciesBalance() },
        async updateCurrenciesBalance() { return await tradeBot.analyzer.updateCurrenciesBalance()},
        // Securities
        async getSecurities() { return await tradeBot.analyzer.getSecurities()},
        async updateSecurities() { return await tradeBot.analyzer.updateSecurities()},
        async getFollowedSecurities() { return await tradeBot.analyzer.getFollowedSecurities()},
        async updateFollowedSecurities() { return await tradeBot.analyzer.updateFollowedSecurities()},
        async followSecurity(params: { ticker: string }) {
            const {ticker} = params
            return await tradeBot.analyzer.followSecurity(ticker)
        },
        async unfollowSecurity(params: { ticker: string }) {
            const {ticker} = params
            return await tradeBot.analyzer.unfollowSecurity(ticker)
        },
        // Portfolio
        async getPortfolio() { return await tradeBot.analyzer.getPortfolio()},
        async updatePortfolio() { return await tradeBot.analyzer.updatePortfolio()},
        async clearPortfolio() { return await tradeBot.analyzer.clearPortfolio()},
        // Orders
        async getOrders(params: GetOrdersOptions){
            if (params.from) params.from = new Date(params.from)
            if (params.to) params.to = new Date(params.to)
            return await tradeBot.analyzer.getOrders(params)
        }

    } as CompatibleService
}
