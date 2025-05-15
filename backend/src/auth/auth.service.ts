import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto.login.dto';
import { RegisterDto } from './dto.register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  private readonly logger = new Logger(AuthService.name);

  constructor(private users: UsersService, private jwtService: JwtService) {}

  async registerManual(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new BadRequestException('El email ya está registrado');
    
    // Aseguramos que la contraseña no sea null antes de hashear
    if (!dto.password) {
      throw new BadRequestException('La contraseña es requerida');
    }
    
    const hashed = await bcrypt.hash(dto.password, 10);
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    const user = await this.users.createManualUser({
      email: dto.email,
      password: hashed,
      name: dto.name,
      emailVerificationToken: token,
      emailVerificationExpires: expires
    });
    const link = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/verify-email?token=${token}`;
    
    try {
      // Usar directamente nodemailer con las credenciales que sabemos que funcionan
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
      
      // Plantilla de email
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
      
      // Enviar email directamente
      this.logger.log(`Sending email to: ${user.email}`); // Log email address
      this.logger.log(`Email content: ${html}`); // Log email content

      const info = await transporter.sendMail({
        from: 'Windsurf App <ezequielbanega@gmail.com>',
        to: user.email,
        subject: 'Verifica tu cuenta en Windsurf',
        html
      });

      this.logger.log(`Email sent: ${info.messageId}`); // Log email response

      console.log('Email de verificación enviado correctamente a:', user.email);
    } catch (error: any) {
      this.logger.error('Error enviando email de verificación:', error);
      this.logger.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        code: error?.code,
        response: error?.response,
        command: error?.command
      });
      throw new HttpException('Error al enviar el correo de verificación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    return { message: 'Registro exitoso. Revisa tu email para activar tu cuenta.' };
  }

  async verifyEmail(token: string) {
    const user = await this.users.findByVerificationToken(token);
    if (!user) throw new NotFoundException('Token inválido');
    if (!('emailVerificationExpires' in user) || !user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      throw new BadRequestException('El enlace de verificación expiró.');
    }
    await this.users.activateUser(user.id);
    return { message: '¡Tu cuenta fue verificada con éxito!' };
  }

  async validateGoogleToken(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new UnauthorizedException('Google token inválido');
    return payload;
  }

  async loginWithGoogle(idToken: string) {
    const profile = await this.validateGoogleToken(idToken);
    const user = await this.users.upsertGoogleUser(profile);
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Aseguramos que la contraseña no sea null
    if (!user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Aseguramos que la contraseña no sea una cadena vacía
    if (user.password === '') {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.logger.log('Comparando contraseña:', {
      password: dto.password,
      hashed: user.password,
      isMatch: await bcrypt.compare(dto.password, user.password)
    });

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user,
    };
  }
}
