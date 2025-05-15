import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para obtener el perfil del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    // El id del usuario viene del JWT (req.user)
    // req.user es asignado por el JwtStrategy
    return this.usersService.findById((req.user as any).userId || (req.user as any).sub);
  }
}
