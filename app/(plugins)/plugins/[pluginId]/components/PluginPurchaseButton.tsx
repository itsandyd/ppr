"use client"

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface PluginPurchaseButtonProps {
    price?: number;
    pluginId: string;
    pricingType: 'FREE' | 'PAID';
    optInFormUrl?: string;
    purchaseUrl?: string;
}

export const PluginPurchaseButton = ({
    price,
    pluginId,
    pricingType,
    optInFormUrl,
    purchaseUrl,
}: PluginPurchaseButtonProps) => {
    // for ${formatPrice(price)}
    const buttonContent = pricingType === 'PAID' && price !== undefined ? `Purchase` : pricingType === 'PAID' ? 'Purchase' : 'Access for Free';
    
    const handleClick = () => {
        const url = pricingType === 'PAID' ? purchaseUrl : optInFormUrl;
        if (url) {
            window.location.href = url;
        }
    };

    return (
        <Button
            size="sm"
            className="w-full md:w-auto"
            onClick={handleClick}
        >
            {buttonContent}
        </Button>
    );
}