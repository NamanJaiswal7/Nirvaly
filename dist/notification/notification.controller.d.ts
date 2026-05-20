import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly svc;
    constructor(svc: NotificationService);
    getNotifications(userId: string): Promise<{
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
    markAsRead(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
