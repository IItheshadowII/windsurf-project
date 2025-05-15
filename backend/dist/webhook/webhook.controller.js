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
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
let WebhookController = WebhookController_1 = class WebhookController {
    constructor() {
        this.logger = new common_1.Logger(WebhookController_1.name);
    }
    async handleMercadoPago(body) {
        this.logger.log('Webhook MP recibido: ' + JSON.stringify(body));
        if (body.type === 'payment' && body.action === 'payment.created') {
            this.logger.log('Pago aprobado: activar usuario');
        }
        if (body.type === 'payment' && body.action === 'payment.failed') {
            this.logger.log('Pago fallido: suspender usuario');
        }
        return { received: true };
    }
    async handleStripe(body) {
        this.logger.log('Webhook Stripe: ' + JSON.stringify(body));
        return { received: true };
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('mp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleMercadoPago", null);
__decorate([
    (0, common_1.Post)('stripe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleStripe", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, common_1.Controller)('webhook')
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map