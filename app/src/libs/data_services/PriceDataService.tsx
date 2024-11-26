import { assetMap } from "../entities/Asset";

import axios from "axios";


export const fetchPriceListMap = async (): Promise<Record<string, number>> => {
    const priceListMap: Record<string, number> = {};

    try {
        // Iterate over all assets in the map
        for (const [address, asset] of Object.entries(assetMap)) {
            // Skip assets without valid tickers
            if (!asset.ticker) continue;

            if (asset.ticker === "FUSD") {
                priceListMap[asset.address] = 1;
                continue;
            }

            // Construct the trading pair
            const symbol = `${asset.ticker}USDT`;

            // Binance API endpoint for the latest price of a symbol
            const url = 'https://api.binance.com/api/v3/ticker/price';

            // Fetch the price for the current asset
            const response = await axios.get(url, { params: { symbol } });

            // Extract the price and add it to the price list map
            const price = response.data.price;
            priceListMap[address] = parseFloat(price);
        }

        console.log('Price List Map:', priceListMap);
    } catch (error) {
        console.error('Error fetching price list map:', error);
    }

    return priceListMap;
};

