import { MessageService } from './message.service';
export declare class MessageController {
    private readonly svc;
    constructor(svc: MessageService);
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
    sendMessage(groupId: string, userId: string, body: {
        content: string;
    }): Promise<{
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
}
