import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.product.findMany({ where: { userId } });
  }
  findOne(id: number, userId: string) {
    return this.prisma.product.findFirst({ where: { id, userId } });
  }
  create(data: any) {
    // data debe incluir userId
    return this.prisma.product.create({ data });
  }
  update(id: number, data: any, userId: string) {
    // Solo permite actualizar si el producto es del usuario
    return this.prisma.product.updateMany({ where: { id, userId }, data });
  }
  remove(id: number, userId: string) {
    // Solo permite borrar si el producto es del usuario
    return this.prisma.product.deleteMany({ where: { id, userId } });
  }
}
