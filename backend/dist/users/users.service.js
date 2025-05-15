"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsertGoogleUser(profile) {
        return this.prisma.user.upsert({
            where: { googleId: profile.sub },
            update: {
                email: profile.email,
                name: profile.name,
                updatedAt: new Date(),
            },
            create: {
                googleId: profile.sub,
                email: profile.email,
                name: profile.name,
                isActive: false,
                subscriptionStatus: 'none',
            },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async createManualUser(data) {
        if (!data.password) {
            throw new common_1.BadRequestException('La contraseña es requerida');
        }
        const userData = {
            email: data.email,
            password: data.password,
            name: data.name,
            isActive: false,
            subscriptionStatus: 'none',
            emailVerificationToken: data.emailVerificationToken,
            emailVerificationExpires: data.emailVerificationExpires,
        };
        return this.prisma.user.create({
            data: userData
        });
    }
    async findByVerificationToken(token) {
        return this.prisma.user.findFirst({ where: { emailVerificationToken: token } });
    }
    async activateUser(id) {
        return this.prisma.user.update({
            where: { id },
            data: {
                isActive: true,
                emailVerificationToken: null,
                emailVerificationExpires: null,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map