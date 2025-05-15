export declare class WebhookController {
    private readonly logger;
    handleMercadoPago(body: any): Promise<{
        received: boolean;
    }>;
    handleStripe(body: any): Promise<{
        received: boolean;
    }>;
}
