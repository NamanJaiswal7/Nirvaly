export declare function withLinks<T>(data: T, links: Record<string, {
    href: string;
    method?: string;
}>): T & {
    _links: typeof links;
};
export declare function matchLinks(matchId: string): {
    self: {
        href: string;
    };
    like: {
        href: string;
        method: string;
    };
};
export declare function groupLinks(groupId: string, status: string): Record<string, {
    href: string;
    method?: string;
}>;
export declare function pollLinks(groupId: string, pollId: string, status: string): Record<string, {
    href: string;
    method?: string;
}>;
export declare function propertyLinks(propertyId: string): {
    self: {
        href: string;
    };
    search: {
        href: string;
    };
    groupPolls: {
        href: string;
    };
};
