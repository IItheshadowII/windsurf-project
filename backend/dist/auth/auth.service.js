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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const google_auth_library_1 = require("google-auth-library");
const bcrypt = require("bcryptjs");
const common_2 = require("@nestjs/common");
const crypto_1 = require("crypto");
let AuthService = AuthService_1 = class AuthService {
    constructor(users, jwtService) {
        this.users = users;
        this.jwtService = jwtService;
        this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async registerManual(dto) {
        const existing = await this.users.findByEmail(dto.email);
        if (existing)
            throw new common_1.BadRequestException('El email ya está registrado');
        if (!dto.password) {
            throw new common_1.BadRequestException('La contraseña es requerida');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = await this.users.createManualUser({
            email: dto.email,
            password: hashed,
            name: dto.name,
            emailVerificationToken: token,
            emailVerificationExpires: expires
        });
        const link = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/verify-email?token=${token}`;
        try {
            const nodemailer = require('nodemailer');
            this.logger.log(`SMTP_USER: '${process.env.SMTP_USER}'`);
            this.logger.log(`SMTP_PASS: '${process.env.SMTP_PASS}'`);
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const html = `
        <div style="font-family: Arial, sans-serif; background: #f6f6f6; padding: 32px;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src='https://accesoit.com.ar/logo192.png' alt='AccesoIT' style='width: 60px; margin-bottom: 12px;' />
              <h2 style="color: #1976d2; margin: 0 0 8px 0;">¡Bienvenido a Windsurf!</h2>
              <div style="font-size: 48px;">📧✅</div>
            </div>
            <p style="font-size: 18px; color: #333;">Hola <b>${user.name}</b>,<br>Gracias por registrarte. Para activar tu cuenta, haz clic en el botón:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${link}" style="background: #1976d2; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">Verificar mi email</a>
            </div>
            <p style="color: #888; font-size: 14px;">Si no solicitaste esta cuenta, ignora este mensaje.</p>
          </div>
        </div>
      `;
            this.logger.log(`Sending email to: ${user.email}`);
            this.logger.log(`Email content: ${html}`);
            const info = await transporter.sendMail({
                from: 'Windsurf App <ezequielbanega@gmail.com>',
                to: user.email,
                subject: 'Verifica tu cuenta en Windsurf',
                html
            });
            this.logger.log(`Email sent: ${info.messageId}`);
            console.log('Email de verificación enviado correctamente a:', user.email);
        }
        catch (error) {
            this.logger.error('Error enviando email de verificación:', error);
            this.logger.error('Error details:', {
                message: error === null || error === void 0 ? void 0 : error.message,
                stack: error === null || error === void 0 ? void 0 : error.stack,
                code: error === null || error === void 0 ? void 0 : error.code,
                response: error === null || error === void 0 ? void 0 : error.response,
                command: error === null || error === void 0 ? void 0 : error.command
            });
            throw new common_2.HttpException('Error al enviar el correo de verificación', common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return { message: 'Registro exitoso. Revisa tu email para activar tu cuenta.' };
    }
    async verifyEmail(token) {
        const user = await this.users.findByVerificationToken(token);
        if (!user)
            throw new common_1.NotFoundException('Token inválido');
        if (!('emailVerificationExpires' in user) || !user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
            throw new common_1.BadRequestException('El enlace de verificación expiró.');
        }
        await this.users.activateUser(user.id);
        return { message: '¡Tu cuenta fue verificada con éxito!' };
    }
    async validateGoogleToken(idToken) {
        const ticket = await this.googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            throw new common_1.UnauthorizedException('Google token inválido');
        return payload;
    }
    async loginWithGoogle(idToken) {
        const profile = await this.validateGoogleToken(idToken);
        const user = await this.users.upsertGoogleUser(profile);
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user,
        };
    }
    async login(dto) {
        const user = await this.users.findByEmail(dto.email);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (user.password === '') {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        this.logger.log('Comparando contraseña:', {
            password: dto.password,
            hashed: user.password,
            isMatch: await bcrypt.compare(dto.password, user.password)
        });
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map