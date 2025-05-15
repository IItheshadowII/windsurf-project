import { ProductsService } from './products.service';
import { Request } from 'express';
export declare class ProductsController {
    private readonly products;
    constructor(products: ProductsService);
    findAll(req: Request): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        category: string;
        supplierId: number | null;
        costPrice: number;
        salePrice: number;
        sku: string;
        stock: number;
        userId: string;
    }[]>;
    findOne(id: string, req: Request): import(".prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        name: string;
        category: string;
        supplierId: number | null;
        costPrice: number;
        salePrice: number;
        sku: string;
        stock: number;
        userId: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    create(data: any, req: Request): import(".prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        name: string;
        category: string;
        supplierId: number | null;
        costPrice: number;
        salePrice: number;
        sku: string;
        stock: number;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: any, req: Request): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    remove(id: string, req: Request): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
