import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { MercadoPagoService } from './mercadopago.service';
import { BillingController } from './billing.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [BillingService, MercadoPagoService],
  controllers: [BillingController],
})
export class BillingModule {}
