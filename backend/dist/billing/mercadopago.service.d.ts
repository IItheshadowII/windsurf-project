export declare class MercadoPagoService {
    private readonly logger;
    private readonly apiUrl;
    private readonly accessToken;
    createPreapproval(email: string, planName: string, returnUrl: string): Promise<any>;
    cancelPreapproval(preapprovalId: string): Promise<boolean>;
}
