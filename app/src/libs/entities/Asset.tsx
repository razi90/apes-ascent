import { FaBitcoin, FaEthereum, FaQuestion } from "react-icons/fa6";
import { ColosseumIcon, ColosseumImageIcon } from '../../components/Icon/ColosseumIcon';

export interface Asset {
    name: string;
    ticker: string;
    symbol: JSX.Element;
    address: string;
}

export const Bitcoin: Asset = {
    name: "Bitcoin",
    ticker: "BTC",
    symbol: <ColosseumIcon icon={FaBitcoin} color="orange.400" />,
    address: "resource_tdx_2_1t503ekk0j6eywphmuav869gr6ah6dac4jl9qv5hqk3732gupdvp3u3",
};

export const Ethereum: Asset = {
    name: "Ether",
    ticker: "ETH",
    symbol: <ColosseumIcon icon={FaEthereum} color="pElement.200" />,
    address: "resource_tdx_2_1tkky3adz9kjyv534amy29uxrqg28uvr8ygm09g4wwr37zajrn0zldg",
};

export const FakeDollar: Asset = {
    name: "USD",
    ticker: "FUSD",
    symbol: <ColosseumImageIcon imageSrc="/images/LogoXUSDC.png" altText="xUSDC Logo" />,
    address: "resource_tdx_2_1tk4slpjr8dndf9kfnz0zq8vxwtzs80tuzp6xwc33vmajac4a99378w",
};

export const Unknown: Asset = {
    name: "Unknown",
    ticker: "Unknown",
    symbol: <ColosseumIcon icon={FaQuestion} color="pElement.200" />,
    address: "Unknown",
};

// Map of assets by address
export const assetMap: Record<string, Asset> = {
    [Bitcoin.address]: Bitcoin,
    [Ethereum.address]: Ethereum,
    [FakeDollar.address]: FakeDollar,
};

// Lookup function for assets
export function addressToAsset(address: string): Asset {
    return assetMap[address] || Unknown;
}
