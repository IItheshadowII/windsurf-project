export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    sendVerificationEmail(to: string, name: string, link: string): Promise<any>;
}
