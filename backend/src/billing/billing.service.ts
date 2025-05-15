import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MercadoPagoService } from './mercadopago.service';

@Injectable()
export class BillingService {
  constructor(
    private users: UsersService,
    private mp: MercadoPagoService,
  ) {}

  async createMercadoPagoSession(email: string, planName: string, returnUrl: string) {
    return this.mp.createPreapproval(email, planName, returnUrl);
  }

  async cancelMercadoPagoSubscription(preapprovalId: string) {
    return this.mp.cancelPreapproval(preapprovalId);
  }

  // Aquí iría lógica Stripe si es necesario
}
