"use client"

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
    
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);
        try {
            const url = pricingType === 'PAID' ? purchaseUrl : optInFormUrl;
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            className="w-full md:w-auto transition-all"
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {pricingType === 'PAID' ? 'Processing...' : 'Redirecting...'}
                </div>
            ) : (
                buttonContent
            )}
        </Button>
    );
}