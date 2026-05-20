import { PrismaService } from '../common/prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, type: string, title: string, body: string, data?: any): Promise<{
        data: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        type: string;
        title: string;
        body: string;
        isRead: boolean;
        createdAt: Date;
        userId: string;
    }>;
    notifyGroupMembers(groupId: string, excludeUserId: string, type: string, title: string, body: string, data?: any): Promise<void>;
    getForUser(userId: string): Promise<{
        notifications: {
            data: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            type: string;
            title: string;
            body: string;
            isRead: boolean;
            createdAt: Date;
            userId: string;
        }[];
        unreadCount: number;
        _links: {
            self: {
                href: string;
            };
        };
    }>;
    markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
