import { UsersService } from '../users/users.service';
import { MercadoPagoService } from './mercadopago.service';
export declare class BillingService {
    private users;
    private mp;
    constructor(users: UsersService, mp: MercadoPagoService);
    createMercadoPagoSession(email: string, planName: string, returnUrl: string): Promise<any>;
    cancelMercadoPagoSubscription(preapprovalId: string): Promise<boolean>;
}
