import { UsersService } from './users.service';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: Request): Promise<{
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
}
