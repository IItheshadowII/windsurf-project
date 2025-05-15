import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billing;
    constructor(billing: BillingService);
    createSession(email: string): Promise<{
        url: any;
    }>;
    cancelSubscription(preapprovalId: string): Promise<{
        ok: boolean;
    }>;
}
