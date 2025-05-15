import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto.login.dto';
import { RegisterDto } from './dto.register.dto';
export declare class AuthService {
    private users;
    private jwtService;
    private googleClient;
    private readonly logger;
    constructor(users: UsersService, jwtService: JwtService);
    registerManual(dto: RegisterDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    validateGoogleToken(idToken: string): Promise<import("google-auth-library").TokenPayload>;
    loginWithGoogle(idToken: string): Promise<{
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
}
