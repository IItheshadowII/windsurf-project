import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { BillingModule } from '../billing/billing.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, BillingModule],
  controllers: [WebhookController],
  // BillingService ahora viene de BillingModule

})
export class WebhookModule {}
