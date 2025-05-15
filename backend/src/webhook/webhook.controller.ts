import { Controller, Post, Req, Body, Logger } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  @Post('mp')
  async handleMercadoPago(@Body() body: any) {
    this.logger.log('Webhook MP recibido: ' + JSON.stringify(body));
    // Lógica demo: activa/suspende según evento
    if (body.type === 'payment' && body.action === 'payment.created') {
      // Aquí buscar usuario y activar
      this.logger.log('Pago aprobado: activar usuario');
    }
    if (body.type === 'payment' && body.action === 'payment.failed') {
      this.logger.log('Pago fallido: suspender usuario');
    }
    return { received: true };
  }
  @Post('stripe')
  async handleStripe(@Body() body: any) {
    this.logger.log('Webhook Stripe: ' + JSON.stringify(body));
    return { received: true };
  }
}
