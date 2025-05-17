import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        TradingView: any;
    }
}

interface TradingViewWidgetProps {
    symbol: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => {
            if (typeof window.TradingView !== 'undefined' && container.current) {
                new window.TradingView.widget({
                    container_id: container.current.id,
                    symbol: symbol,
                    interval: "D",
                    timezone: "Etc/UTC",
                    theme: "dark",
                    style: "1",
                    locale: "en",
                    toolbar_bg: "#f1f3f6",
                    enable_publishing: false,
                    allow_symbol_change: true,
                    save_image: false,
                    height: "100%",
                    width: "100%",
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [symbol]);

    return (
        <div
            id="tradingview_widget"
            ref={container}
            style={{ height: "100%", width: "100%" }}
        />
    );
};

export default TradingViewWidget;