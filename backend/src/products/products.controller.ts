import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAll(@Req() req: Request) {
    const userId = (req.user as any).userId || (req.user as any).sub;
    return this.products.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId || (req.user as any).sub;
    return this.products.findOne(Number(id), userId);
  }

  @Post()
  create(@Body() data: any, @Req() req: Request) {
    const userId = (req.user as any).userId || (req.user as any).sub;
    return this.products.create({ ...data, userId });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Req() req: Request) {
    const userId = (req.user as any).userId || (req.user as any).sub;
    return this.products.update(Number(id), data, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).userId || (req.user as any).sub;
    return this.products.remove(Number(id), userId);
  }
}

