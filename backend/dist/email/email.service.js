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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.logger.log('Inicializando EmailService con credenciales fijas');
        try {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'ezequielbanega@gmail.com',
                    pass: 'ylgzndrrgjjusjqp',
                },
                tls: {
                    rejectUnauthorized: false,
                },
                debug: true,
            });
            this.logger.log('Transporter creado correctamente');
        }
        catch (error) {
            this.logger.error('Error al crear el transporter:', error);
        }
    }
    async sendVerificationEmail(to, name, link) {
        this.logger.log(`Enviando email de verificación a ${to}`);
        try {
            if (!this.transporter) {
                this.logger.error('Transporter no inicializado');
                throw new Error('Transporter no inicializado');
            }
            const html = `
        <div style="font-family: Arial, sans-serif; background: #f6f6f6; padding: 32px;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src='https://accesoit.com.ar/logo192.png' alt='AccesoIT' style='width: 60px; margin-bottom: 12px;' />
              <h2 style="color: #1976d2; margin: 0 0 8px 0;">¡Bienvenido a AccesoIT!</h2>
              <div style="font-size: 48px;">📧✅</div>
            </div>
            <p style="font-size: 18px; color: #333;">Hola <b>${name}</b>,<br>Gracias por registrarte. Para activar tu cuenta, haz clic en el botón:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${link}" style="background: #1976d2; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">Verificar mi email</a>
            </div>
            <p style="color: #888; font-size: 14px;">Si no solicitaste esta cuenta, ignora este mensaje.</p>
          </div>
        </div>
      `;
            const result = await this.transporter.sendMail({
                from: 'Windsurf App <ezequielbanega@gmail.com>',
                to,
                subject: 'Verifica tu cuenta en AccesoIT',
                html,
            });
            this.logger.log(`Email enviado correctamente: ${result.messageId}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error al enviar email: ${error.message || 'Error desconocido'}`, error.stack);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map