import { PrismaService } from '../prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    findOne(id: number, userId: string): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    create(data: any): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    update(id: number, data: any, userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    remove(id: number, userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
