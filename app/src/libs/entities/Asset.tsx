import { FaBitcoin, FaEthereum, FaQuestion } from "react-icons/fa6";
import { ColosseumIcon, ColosseumImageIcon } from '../../components/Icon/ColosseumIcon';

export interface Asset {
    name: string;
    ticker: string;
    symbol: JSX.Element;
    address: string;
    price_key: string;
}

export const Bitcoin: Asset = {
    name: "Bitcoin",
    ticker: "BTC",
    symbol: <ColosseumIcon icon={FaBitcoin} color="orange.400" />,
    address: "resource_tdx_2_1t503ekk0j6eywphmuav869gr6ah6dac4jl9qv5hqk3732gupdvp3u3",
    price_key: "5c2102805d59b33d9910003c02e2fadf03603776a33f4530333319b07339298a3486805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6",
};

export const Ethereum: Asset = {
    name: "Ether",
    ticker: "ETH",
    symbol: <ColosseumIcon icon={FaEthereum} color="pElement.200" />,
    address: "resource_tdx_2_1tkky3adz9kjyv534amy29uxrqg28uvr8ygm09g4wwr37zajrn0zldg",
    price_key: "5c2102805dac48f5a22da4465235eec8a2f0c302147e30672236f2a2ae70e3e17643805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6",
};

export const FakeDollar: Asset = {
    name: "USD",
    ticker: "FUSD",
    symbol: <ColosseumImageIcon imageSrc="/images/LogoXUSDC.png" altText="xUSDC Logo" />,
    address: "resource_tdx_2_1tk4slpjr8dndf9kfnz0zq8vxwtzs80tuzp6xwc33vmajac4a99378w",
    price_key: "5c2102805d871d77971fa419bfc4659768f350a4178d95836a12f35da4d950c7974c805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6",
};

export const Unknown: Asset = {
    name: "Unknown",
    ticker: "Unknown",
    symbol: <ColosseumIcon icon={FaQuestion} color="pElement.200" />,
    address: "Unknown",
    price_key: "Unknown",
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
