import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async upsertGoogleUser(profile: any) {
    return this.prisma.user.upsert({
      where: { googleId: profile.sub },
      update: {
        email: profile.email,
        name: profile.name,
        updatedAt: new Date(),
      },
      create: {
        googleId: profile.sub,
        email: profile.email,
        name: profile.name,
        isActive: false,
        subscriptionStatus: 'none',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createManualUser(data: { email: string; password: string; name: string; emailVerificationToken?: string; emailVerificationExpires?: Date }) {
    // Aseguramos que la contraseña se almacene correctamente y no sea null
    if (!data.password) {
      throw new BadRequestException('La contraseña es requerida');
    }

    const userData = {
      email: data.email,
      password: data.password, // Aseguramos que la contraseña no sea null
      name: data.name,
      isActive: false,
      subscriptionStatus: 'none',
      emailVerificationToken: data.emailVerificationToken,
      emailVerificationExpires: data.emailVerificationExpires,
    } as any;
    
    return this.prisma.user.create({
      data: userData
    });
  }

  async findByVerificationToken(token: string) {
    return this.prisma.user.findFirst({ where: { emailVerificationToken: token as any } });
  }

  async activateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      } as any,
    });
  }
}
