import { PrismaService } from '../common/prisma.service';
export declare class MessageService {
    private prisma;
    constructor(prisma: PrismaService);
    getMessages(groupId: string, userId: string): Promise<{
        messages: ({
            user: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            groupId: string;
            content: string;
        })[];
        _links: {
            self: {
                href: string;
            };
            send: {
                href: string;
                method: string;
            };
            group: {
                href: string;
            };
        };
    }>;
    sendMessage(groupId: string, userId: string, content: string): Promise<{
        _links: {
            group: {
                href: string;
            };
            messages: {
                href: string;
            };
        };
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        id: string;
        createdAt: Date;
        userId: string;
        groupId: string;
        content: string;
    }>;
    sendSystemMessage(groupId: string, systemUserId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        groupId: string;
        content: string;
    }>;
}
