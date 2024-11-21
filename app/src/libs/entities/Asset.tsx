import { FaBitcoin, FaEthereum, FaQuestion } from "react-icons/fa6";
import { ColosseumIcon, ColosseumImageIcon } from '../../components/Icon/ColosseumIcon';

export interface Asset {
    name: string;
    ticker: string;
    symbol: JSX.Element;
    address: string;
    price_key: string;
}

export const Radix: Asset = {
    name: "Radix",
    ticker: "XRD",
    symbol: <ColosseumImageIcon imageSrc="/images/LogoRadix.png" altText="Radix Logo" />,
    address: "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc",
    price_key: "5c2102805d871d77971fa419bfc4659768f350a4178d95836a12f35da4d950c7974c805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6",
};

export const Bitcoin: Asset = {
    name: "Radix Wrapped Bitcoin",
    ticker: "xwBTC",
    symbol: <ColosseumIcon icon={FaBitcoin} color="orange.400" />,
    address: "resource_tdx_2_1t503ekk0j6eywphmuav869gr6ah6dac4jl9qv5hqk3732gupdvp3u3",
    price_key: "5c2102805d59b33d9910003c02e2fadf03603776a33f4530333319b07339298a3486805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6",
};

export const Ethereum: Asset = {
    name: "Radix Wrapped Ether",
    ticker: "xETH",
    symbol: <ColosseumIcon icon={FaEthereum} color="pElement.200" />,
    address: "resource_tdx_2_1tkky3adz9kjyv534amy29uxrqg28uvr8ygm09g4wwr37zajrn0zldg",
    price_key: "5c2102805dac48f5a22da4465235eec8a2f0c302147e30672236f2a2ae70e3e17643805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6",
};

export const USDollar: Asset = {
    name: "FakeUSD",
    ticker: "FUSD",
    symbol: <ColosseumImageIcon imageSrc="/images/LogoXUSDC.png" altText="xUSDC Logo" />,
    address: "resource_tdx_2_1tk4slpjr8dndf9kfnz0zq8vxwtzs80tuzp6xwc33vmajac4a99378w",
    price_key: "5c2102805d871d77971fa419bfc4659768f350a4178d95836a12f35da4d950c7974c805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6",
};

export const Hug: Asset = {
    name: "Hug",
    ticker: "HUG",
    symbol: <ColosseumImageIcon imageSrc="/images/LogoHug.png" altText="Hug Logo" />,
    address: "resource_tdx_2_1thtxzder4ncupdg47h6zktdnl6p4yqznttv6nuxvzcsntfhthz6m6m",
    price_key: "5c2102805dd6613723acf1c0b515f5f42b2db3fe835200535ad9a9f0cc162135a6eb805da66318c6318c61f5a61b4c6318c6318cf794aa8d295f14e6318c6318c6",
};

export const Unknown: Asset = {
    name: "Unknown",
    ticker: "Unknown",
    symbol: <ColosseumIcon icon={FaQuestion} color="pElement.200" />,
    address: "Unknown",
    price_key: "Unknown",
};

export function addressToAsset(address: string): Asset {
    switch (address) {
        case Radix.address:
            return Radix;
        case Bitcoin.address:
            return Bitcoin;
        case Ethereum.address:
            return Ethereum;
        case USDollar.address:
            return USDollar;
        case Hug.address:
            return Hug;
        default:
            return USDollar;
    }
};