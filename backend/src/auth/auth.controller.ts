import { Controller, Post, Body, Get, Query, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto.login.dto';
import { RegisterDto } from './dto.register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('google')
  async googleLogin(@Body('idToken') idToken: string) {
    return this.auth.loginWithGoogle(idToken);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.registerManual(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new HttpException('Token de verificación no proporcionado', HttpStatus.BAD_REQUEST);
    }
    return this.auth.verifyEmail(token);
  }
}
