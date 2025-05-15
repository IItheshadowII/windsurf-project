import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private readonly apiUrl = 'https://api.mercadopago.com';
  private readonly accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  async createPreapproval(email: string, planName: string, returnUrl: string) {
    const body = {
      reason: planName,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 1000, // ARS, ajusta según tu plan
        currency_id: 'ARS',
      },
      back_url: returnUrl,
      payer_email: email,
    };
    const { data } = await axios.post(
      `${this.apiUrl}/preapproval`,
      body,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    return data;
  }

  async cancelPreapproval(preapprovalId: string) {
    await axios.put(
      `${this.apiUrl}/preapproval/${preapprovalId}`,
      { status: 'cancelled' },
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    return true;
  }
}
