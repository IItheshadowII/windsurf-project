"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MercadoPagoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let MercadoPagoService = MercadoPagoService_1 = class MercadoPagoService {
    constructor() {
        this.logger = new common_1.Logger(MercadoPagoService_1.name);
        this.apiUrl = 'https://api.mercadopago.com';
        this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    }
    async createPreapproval(email, planName, returnUrl) {
        const body = {
            reason: planName,
            auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                transaction_amount: 1000,
                currency_id: 'ARS',
            },
            back_url: returnUrl,
            payer_email: email,
        };
        const { data } = await axios_1.default.post(`${this.apiUrl}/preapproval`, body, { headers: { Authorization: `Bearer ${this.accessToken}` } });
        return data;
    }
    async cancelPreapproval(preapprovalId) {
        await axios_1.default.put(`${this.apiUrl}/preapproval/${preapprovalId}`, { status: 'cancelled' }, { headers: { Authorization: `Bearer ${this.accessToken}` } });
        return true;
    }
};
exports.MercadoPagoService = MercadoPagoService;
exports.MercadoPagoService = MercadoPagoService = MercadoPagoService_1 = __decorate([
    (0, common_1.Injectable)()
], MercadoPagoService);
//# sourceMappingURL=mercadopago.service.js.map