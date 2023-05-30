import { Chains } from "./types/chains"
import { registry } from "./types/registry";

/**
 * Initialize initial Cosmos chains into local storage from the chain registry.
 *
 * @param args - The request handler args as object.
 * @returns The result of the method (boolean).
 * @throws If an error occurs.
 */
export const initializeChains = async (): Promise<Chains> => {
    // Call each default chain from chain registry urls using hardcoded list of default chains
    let retPromises = registry.map(chain => fetch(chain.url));
    let rets = await Promise.all(retPromises);
    let all = await Promise.all(rets.map(ret => ret.json()))

    // Map all registry chain data for all chains to our Chain type
    let chainList = all.map(data => {
        return {
            chain_id: data.chain_id,
            name: data.name,
            rpc: data.rpc,
            coin_type: data.coin_type,
            prefix: data.prefix,
            gas: {
                default: data.gas.default,
                denom: data.gas.denom
            },
        }
    })

    // Initialize a chains class with all the default chains
    let chains = new Chains(chainList);
    return chains
}