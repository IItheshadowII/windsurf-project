"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const billing_service_1 = require("./billing.service");
let BillingController = class BillingController {
    constructor(billing) {
        this.billing = billing;
    }
    async createSession(email) {
        const planName = 'Suscripción mensual Almacencito';
        const returnUrl = 'https://yourdomain.com/pago-exitoso';
        const data = await this.billing.createMercadoPagoSession(email, planName, returnUrl);
        return { url: data.init_point || data.sandbox_init_point };
    }
    async cancelSubscription(preapprovalId) {
        await this.billing.cancelMercadoPagoSubscription(preapprovalId);
        return { ok: true };
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('create-session'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createSession", null);
__decorate([
    (0, common_1.Post)('cancel'),
    __param(0, (0, common_1.Body)('preapprovalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "cancelSubscription", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map