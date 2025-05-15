import { Controller, Post, Req, Body } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Post('create-session')
  async createSession(@Body('email') email: string) {
    // Demo: usar email recibido, plan fijo y returnUrl dummy
    const planName = 'Suscripción mensual Almacencito';
    const returnUrl = 'https://yourdomain.com/pago-exitoso';
    const data = await this.billing.createMercadoPagoSession(email, planName, returnUrl);
    return { url: data.init_point || data.sandbox_init_point };
  }

  @Post('cancel')
  async cancelSubscription(@Body('preapprovalId') preapprovalId: string) {
    await this.billing.cancelMercadoPagoSubscription(preapprovalId);
    return { ok: true };
  }
}
