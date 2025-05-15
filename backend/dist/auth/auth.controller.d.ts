import { AuthService } from './auth.service';
import { LoginDto } from './dto.login.dto';
import { RegisterDto } from './dto.register.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    googleLogin(idToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
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
        };
    }>;
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
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
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
}
