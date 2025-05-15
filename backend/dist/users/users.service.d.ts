import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    upsertGoogleUser(profile: any): Promise<{
        id: string;
        googleId: string | null;
        email: string;
        password: string | null;
        name: string;
        isActive: boolean;
        subscriptionStatus: string;
        currentPeriodEnd: Date | null;
        createdAt: Date;
        updatedAt: Date;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
    }>;
    findById(id: string): Promise<{
        id: string;
        googleId: string | null;
        email: string;
        password: string | null;
        name: string;
        isActive: boolean;
        subscriptionStatus: string;
        currentPeriodEnd: Date | null;
        createdAt: Date;
        updatedAt: Date;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
    } | null>;
    findByEmail(email: string): Promise<{
        id: string;
        googleId: string | null;
        email: string;
        password: string | null;
        name: string;
        isActive: boolean;
        subscriptionStatus: string;
        currentPeriodEnd: Date | null;
        createdAt: Date;
        updatedAt: Date;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
    } | null>;
    createManualUser(data: {
        email: string;
        password: string;
        name: string;
        emailVerificationToken?: string;
        emailVerificationExpires?: Date;
    }): Promise<{
        id: string;
        googleId: string | null;
        email: string;
        password: string | null;
        name: string;
        isActive: boolean;
        subscriptionStatus: string;
        currentPeriodEnd: Date | null;
        createdAt: Date;
        updatedAt: Date;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
    }>;
    findByVerificationToken(token: string): Promise<{
        id: string;
        googleId: string | null;
        email: string;
        password: string | null;
        name: string;
        isActive: boolean;
        subscriptionStatus: string;
        currentPeriodEnd: Date | null;
        createdAt: Date;
        updatedAt: Date;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
    } | null>;
    activateUser(id: string): Promise<{
        id: string;
        googleId: string | null;
        email: string;
        password: string | null;
        name: string;
        isActive: boolean;
        subscriptionStatus: string;
        currentPeriodEnd: Date | null;
        createdAt: Date;
        updatedAt: Date;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
    }>;
}
