import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: nodemailer.Transporter; // El signo ! indica que se inicializará en el constructor
  constructor() {
    this.logger.log('Inicializando EmailService con credenciales fijas');
    
    try {
      // Configuraciu00f3n fija que sabemos que funciona (como en el test manual)
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
        debug: true, // Activar debug para ver mu00e1s informaciu00f3n
      });
      
      this.logger.log('Transporter creado correctamente');
    } catch (error) {
      this.logger.error('Error al crear el transporter:', error);
    }
  }

  async sendVerificationEmail(to: string, name: string, link: string) {
    this.logger.log(`Enviando email de verificación a ${to}`);
    
    try {
      // Verificar que el transporter existe
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
      
      // Usar credenciales fijas para el from también
      const result = await this.transporter.sendMail({
        from: 'Windsurf App <ezequielbanega@gmail.com>',
        to,
        subject: 'Verifica tu cuenta en AccesoIT',
        html,
      });
      
      this.logger.log(`Email enviado correctamente: ${result.messageId}`);
      return result;
    } catch (error: any) { // Tipamos error como any para acceder a message y stack
      this.logger.error(`Error al enviar email: ${error.message || 'Error desconocido'}`, error.stack);
      throw error;
    }
  }
}
